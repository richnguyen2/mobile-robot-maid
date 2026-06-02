#include "navigation_controller.h"

NavigationController::NavigationController(ImuInterface* imu_ptr, MotorDriver* motor_ptr, DistanceSensorInterface* sonar_ptr)
    : imu(imu_ptr), motors(motor_ptr), sonar(sonar_ptr), 
      current_state(NavState::IDLE), target_heading(0.0f), 
      maneuver_start_time(0), maneuver_duration_ms(0), base_linear_vel(1.25f) {}

// Distance is in ft
void NavigationController::command_drive_straight(float distance) {
    target_heading = imu->get_heading();
    maneuver_duration_ms = static_cast<unsigned long>((distance / base_linear_vel) * 1000.0f);
    maneuver_start_time = millis();
    current_state = NavState::DRIVE_STRAIGHT;
}

void NavigationController::command_turn(float degrees_to_turn) {
    target_heading = imu->get_heading() + degrees_to_turn;
    current_state = NavState::TURN_IN_PLACE;
}

void NavigationController::command_stop() {
    current_state = NavState::IDLE;
    motors->stop();
}

void NavigationController::update(NavState new_state, float distance, float degrees_to_turn) {
    
    switch (new_state) {
        case NavState::DRIVE_STRAIGHT: {
            command_drive_straight(distance);
            break;
        }
        case NavState::TURN_IN_PLACE: {
            command_turn(degrees_to_turn);
            break;
        }
    }

    while (current_state == new_state)
    {
    imu->update();

    float current_heading = imu->get_heading();
    float obstacle_dist = sonar->get_distance();
  
    //if (obstacle_dist < OBSTACLE_THRESHOLD && current_state != NavState::IDLE) {
    //    command_stop();
    //    current_state = NavState::OBSTACLE_AVOIDANCE;
    //    return;
    //}

    // State Machine
    switch (current_state) {
        case NavState::DRIVE_STRAIGHT: {
            if ((millis() - maneuver_start_time) >= maneuver_duration_ms) {
                command_stop();
                break;
            }
            
            // Closed-loop heading correction
            float heading_error = current_heading - target_heading;
            int base_pwm = motors->velocity_to_pwm(base_linear_vel);
            float correction = heading_error * KP_HEADING;

            int left_pwm = static_cast<int>(base_pwm - correction);
            int right_pwm = static_cast<int>(base_pwm + correction);
            motors->command_motors(left_pwm, right_pwm);
            break;
        }

        case NavState::TURN_IN_PLACE: {
            float error = target_heading - current_heading;
            
            // If within 2 degrees of target, stop
            if (abs(error) <= 10.0f) {
                command_stop();
            } else {
                // Spin in place. Positive error means turn right.
                int spin_pwm = 100; // Hardcoded spin speed
                if (error > 0) {
                    motors->command_motors(spin_pwm, -spin_pwm); // Turn Right
                } else {
                    motors->command_motors(-spin_pwm, spin_pwm); // Turn Left
                }
            }
            break;
        }
            
        case NavState::IDLE:
        case NavState::OBSTACLE_AVOIDANCE:
            motors->stop();
            break; 
    }
    }
}