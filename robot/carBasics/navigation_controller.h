#ifndef NAVIGATION_CONTROLLER_H
#define NAVIGATION_CONTROLLER_H

#include "sensor_interfaces.h"
#include "motor_driver.h"

enum class NavState {
    IDLE,
    DRIVE_STRAIGHT,
    TURN_IN_PLACE,
    OBSTACLE_AVOIDANCE
};

class NavigationController {
private:
    ImuInterface* imu;
    MotorDriver* motors;
    DistanceSensorInterface* sonar; 

    NavState current_state;
    float target_heading;
    unsigned long maneuver_start_time;
    unsigned long maneuver_duration_ms;

    float base_linear_vel;
    
    static constexpr float OBSTACLE_THRESHOLD = 10.0f;
    static constexpr float KP_HEADING = 2.0f;

public:
    NavigationController(ImuInterface* imu_ptr, MotorDriver* motor_ptr, DistanceSensorInterface* sonar_ptr);

    void command_drive_straight(float distance);
    void command_turn(float degrees_to_turn);
    void command_stop();
    
    void update();
    NavState get_state() const { return current_state; }
};

#endif