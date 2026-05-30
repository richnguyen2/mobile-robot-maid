import numpy as np
import serial
import time
import random

rows, cols = 3, 3
headings = 4
arduinoData = serial.Serial('COM5', 9600, timeout=2)

# Initial belief is uniform across all rows, cols, and headings
bel = np.ones((rows, cols, headings)) / (rows * cols * headings)

# 0: North (Up), 1: East (Right), 2: South (Down), 3: West (Left)
movements = {
    0: (-1, 0),  # North
    1: (0, 1),   # East
    2: (1, 0),   # South
    3: (0, -1)   # West
}

# The actions the robot can execute
actions = ['forward', 'turn_left', 'turn_right']

# Turning is 100% reliable in place for simplicity
def transition_probability(new_r, new_c, new_h, old_r, old_c, old_h, action):

    # --- ACTION: TURN LEFT (No movement, rotate counter-clockwise) ---
    if action == 'turn_left':
        expected_h = (old_h - 1) % 4
        if new_r == old_r and new_c == old_c and new_h == expected_h:
            return 1.0
        return 0.0

    # --- ACTION: TURN RIGHT (No movement, rotate clockwise) ---
    if action == 'turn_right':
        expected_h = (old_h + 1) % 4
        if new_r == old_r and new_c == old_c and new_h == expected_h:
            return 1.0
        return 0.0

    # --- ACTION: FORWARD (Movement with 10-degree drift emulation) ---
    if action == 'forward':
        # Calculate Intended Straight Path
        s_dr, s_dc = movements[old_h]
        s_r = old_r + s_dr
        s_c = old_c + s_dc
        if s_r < 0 or s_r >= rows or s_c < 0 or s_c >= cols:
            s_r, s_c = old_r, old_c  # Hit wall, stay put

        # Calculate Drift Left Path (Heading changes counter-clockwise)
        left_h = (old_h - 1) % 4
        l_dr, l_dc = movements[left_h]
        l_r = old_r + l_dr
        l_c = old_c + l_dc
        if l_r < 0 or l_r >= rows or l_c < 0 or l_c >= cols:
            l_r, l_c = old_r, old_c # Hit wall, stay put

        # Calculate Drift Right Path (Heading changes clockwise)
        right_h = (old_h + 1) % 4
        r_dr, r_dc = movements[right_h]
        r_r = old_r + r_dr
        r_c = old_c + r_dc
        if r_r < 0 or r_r >= rows or r_c < 0 or r_c >= cols:
            r_r, r_c = old_r, old_c  # Hit wall, stay put

        # Calculate Overshoot Path (2 blocks straight forward)
        o_r = old_r + (s_dr * 2)
        o_c = old_c + (s_dc * 2)
        # Boundary check for overshoot
        if o_r < 0 or o_r >= rows or o_c < 0 or o_c >= cols:
            # If it overshoots out of bounds, it smashes into the wall at the edge
            o_r, o_c = s_r, s_c

        # --- Accumulate Probabilities ---
        prob = 0.0

        # Intended straight path (70%)
        if new_r == s_r and new_c == s_c and new_h == old_h:
            prob += 0.70

        # Accidental drift left (10%)
        if new_r == l_r and new_c == l_c and new_h == left_h:
            prob += 0.1

        # Accidental drift right (10%)
        if new_r == r_r and new_c == r_c and new_h == right_h:
            prob += 0.1

        # Undershoot / Wheel slip (5%) -> stay in same cell
        if new_r == old_r and new_c == old_c and new_h == old_h:
            prob += 0.05

        # Overshoot (5%) -> Robot shoots forward 2 cells
        if new_r == o_r and new_c == o_c and new_h == old_h:
            prob += 0.05

        return prob

    return 0.0

def compute_bel_bar(bel, action):
    # Shape is now (3, 3, 4) for rows, cols, headings
    bel_bar = np.zeros((rows, cols, headings))

    # --- OUTER LOOPS: Iterate over every possible NEW state ---
    for new_r in range(rows):
        for new_c in range(cols):
            for new_h in range(headings):  # Added loop for new heading
                
                total_prob = 0.0
                
                # --- INNER LOOPS: Iterate over every possible OLD state ---
                for old_r in range(rows):
                    for old_c in range(cols):
                        for old_h in range(headings):  # Added loop for old heading
                            
                            prob = transition_probability(new_r, new_c, new_h, old_r, old_c, old_h, action)
                            
                            # Multiply by the 3D prior belief
                            total_prob += prob * bel[old_r, old_c, old_h]
                
                # Save the accumulated total into the 3D prediction tensor
                bel_bar[new_r, new_c, new_h] = total_prob  
    
    return bel_bar

# What the robot sees in every cell when facing NORTH
view_north = [
    ['medium',  'medium',  'medium'],
    ['long',   'long',   'long'],
    ['long', 'long', 'long']
]

# What the robot sees in every cell when facing EAST
view_east = [
    ['long', 'medium', 'medium'],
    ['medium', 'short', 'short'],
    ['long', 'medium', 'medium']
]

# What the robot sees in every cell when facing SOUTH
view_south = [
    ['long',  'long',  'long'],
    ['long',   'long',   'long'],
    ['long', 'long', 'long']
]

# What the robot sees in every cell when facing WEST
view_west = [
    ['short', 'short', 'medium'],
    ['short', 'short', 'medium'],
    ['short', 'short', 'medium']
]

# Stack them together along the 3rd axis (axis=2) to create the 3D tensor
landmarks = np.stack([view_north, view_east, view_south, view_west], axis=2)

def sensor_probability(r, c, h, measurement):
    actual_range = landmarks[r, c, h]
    
    # ----------------------------------------------------
    # Case 1: The map says this cell has a SHORT distance
    # ----------------------------------------------------
    if actual_range == "short":
        if measurement == "short":
            return 0.80  # Correct
        elif measurement == "medium":
            return 0.10  # 20% error split: more likely to misread as medium than long
        elif measurement == "long":
            return 0.05  # Highly unlikely to misread a short distance as long
        elif measurement == "timeout":
            return 0.05  # Sensor error of no reading
            
    # ----------------------------------------------------
    # Case 2: The map says this cell has a MEDIUM distance
    # ----------------------------------------------------
    elif actual_range == "medium":
        if measurement == "medium":
            return 0.80  # Correct
        elif measurement == "short":
            return 0.075  # 20% error split evenly between short and long
        elif measurement == "long":
            return 0.075
        elif measurement == "timeout":
            return 0.05  # Sensor error of no reading
            
    # ----------------------------------------------------
    # Case 3: The map says this cell has a LONG distance
    # ----------------------------------------------------
    elif actual_range == "long":
        if measurement == "long":
            return 0.80  # Correct
        elif measurement == "medium":
            return 0.10  # 20% error split
        elif measurement == "short":
            return 0.05
        elif measurement == "timeout":
            return 0.05  # Sensor error of no reading
            
    return 0.0

def compute_bel(bel_bar, measurement):
    bel = np.zeros((rows, cols, headings))
    
    # --- Iterate over every possible physical cell and heading ---
    for r in range(rows):
        for c in range(cols):
            for h in range(headings):
                
                # 2. Pass row, col, AND current heading to the sensor model
                sensor_prob = sensor_probability(r, c, h, measurement)
                
                # 3. Multiply the predicted belief by the sensor likelihood
                bel[r, c, h] = bel_bar[r, c, h] * sensor_prob
                
    # Normalize the entire 3D tensor
    bel = bel / bel.sum()
    
    return bel

print("Time step: 0")
spatial_map = np.sum(bel, axis=2)
print(spatial_map)


action_sequence = ["start"]
#, , "turn_left", "forward","turn_right", "forward", "turn_right", "forward", 
    #               "turn_right", "forward", "forward", "turn_right", "forward", "forward"

t = 0
for action in action_sequence:
    # Send action to arduino
    cmd = action + '\r'
    print(cmd)
    arduinoData.write(cmd.encode())

    # Sensor Measurement
    # ----------------------------
    #  Wait for Arduino response
    # ----------------------------

    detected = None

    detected = arduinoData.readline().decode().strip()   
    print("Detected:", detected)

    # Prediction step (motion model)
    # ----------------------------
    bel_bar = compute_bel_bar(bel, action)
    if action == "start":
        bel_bar = bel

    # ----------------------------
    # Correction step (or skip)
    # ----------------------------
    if detected in ["short", "medium", "long"]:
        bel = compute_bel(bel_bar, detected)
    else:
        print("Timed out -> Skip correction")
        print("bel_bar: ", np.sum(bel_bar))
        bel = bel_bar

    # Belief Visualization
    print("Time step: ", t+1)
    spatial_map = np.sum(bel, axis=2)
    print("Belief:\n", spatial_map)
    t += 1