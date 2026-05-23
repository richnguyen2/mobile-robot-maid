#ifndef CAR_MOVEMENT_H
#define CAR_MOVEMENT_H

class carBase final {
  private:
    // Motor pins 
    static constexpr int STBY = 3; // Motor Controller Enable
    static constexpr int pwmRight = 5; // Right Wheel Power
    static constexpr int rightDir = 7; // Right Wheel Direction
    static constexpr int pwmLeft = 6; // Left Wheels Power
    static constexpr int leftDir = 8; // Left Wheel Direction

    float linearVel;
    float angularVel;

    bool moving = false;
    unsigned long startTime = 0;
    unsigned long moveDuration = 0;

    static constexpr float OBSTACLE_THRESHOLD = 10.0f;

    // PWM calculation for linearVel and angularVel
    float calcLinearPWM(float linearVel);
    float calcAngularPWM(float angularVel);

  public:
    // Constructor
    carBase(float linVel = 1.25f, float angVel = 180.0f);

    // Pin setup
    void begin();
  
    // Movement functions
    void moveForward(float distance);
    void moveForward(float distance, float linVel);
    void moveBackward(float distance);
    void moveBackward(float distance, float linVel);
    void turnRight(float angle);
    void turnRight(float angle, float angVel);
    void turnLeft(float angle);
    void turnLeft(float angle, float angVel);
    void update(float measuredDistance);
    void stop();

    // Get variables
    float getLinearVel() { return linearVel; }
    float getAngularVel() { return angularVel; };

    // Set variables
    void setLinearVel(float vel);
    void setAngularVel(float vel);

};

#endif