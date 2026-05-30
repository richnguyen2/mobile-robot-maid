import numpy as np

# Initial belief
rows, cols = 3, 3
bel = np.ones((rows, cols)) / (rows * cols)
print("Time step: 0")
print(bel)

# Map of landmarks (e.g., 'W' for wall, 'D' for door)
landmarks = np.array([
    ['W', 'W', 'W'],
    ['W', 'D', 'W'],
    ['D', 'W', 'W']
])

actions = {
    'left': (0, -1),
    'right': (0, 1),
    'up': (-1, 0),
    'down': (1, 0)
}

# Transition probability now depends on multiple actions
def transition_probability(new_r, new_c, old_r, old_c, action):
    # Determine where the robot *should* end up given the action
    dr, dc = actions[action]
    expected_r = old_r + dr
    expected_c = old_c + dc

    # Out of bounds = Stay
    if expected_r < 0 or expected_r >= rows or expected_c < 0 or expected_c >= cols:
        expected_r, expected_c = old_r, old_c

    prob = 0.0

    # Intentional probability
    if new_r == expected_r and new_c == expected_c:
        prob += 0.8 

    # Slip probability, same state
    if new_r == old_r and new_c == old_c:
        prob += 0.2 

    return prob

def compute_bel_bar(bel, action):
    bel_bar = np.zeros((rows, cols))

    # Iterate over every possible new state (where we might be now)
    for new_r in range(rows):
        for new_c in range(cols):
            total_prob = 0
            
            # Iterate over every possible old state (where we came from)
            for old_r in range(rows):
                for old_c in range(cols):
                    # Get probability of new state based on old state and action
                    prob = transition_probability(new_r, new_c, old_r, old_c, action)
                    total_prob += prob * bel[old_r, old_c]
            
            bel_bar[new_r, new_c] = total_prob  
    
    return bel_bar

def sensor_probability(r, c, measurement):
    actual_landmark = landmarks[r, c]
   
    # Robot is actually at a wall
    if actual_landmark == 'W':
        if measurement == 'W':
            return 0.75
        elif measurement == 'D':
            return 0.25
    
    # Robot is actually at a door
    elif actual_landmark == 'D':
        if measurement == 'D':
            return 0.7
        elif measurement == 'W':
            return 0.3

def compute_bel(bel_bar, measurement):
    bel = np.zeros((rows, cols))
    for r in range(rows):
        for c in range(cols):
            sensor_prob = sensor_probability(r, c, measurement)
            bel[r, c] = bel_bar[r, c] * sensor_prob
            
    # Normalize the 2D grid
    bel = bel / bel.sum()
    return bel

# Iterate through time step
time_steps = 2
for i in range(time_steps):
    # Motion Belief
    action = input("Action taken? (left, right, up, down) ")
    bel_bar = compute_bel_bar(bel, action)
    print("Bel Bar: ", np.sum(bel_bar))
    # Sensor Measurement
    detected = input("Bot detected D or W? ")

    # Corrected Belief
    bel = compute_bel(bel_bar, detected)
    print("Time step: ", i+1)
    print("Belief:\n", bel)