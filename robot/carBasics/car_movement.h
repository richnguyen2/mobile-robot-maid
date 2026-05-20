#ifndef CAR_MOVEMENT
#define CAR_MOVEMENT

class carBase {
  private:
    // Motor pins 
    int STBY = 3; // Motor Controller Enable
    int pwmRight = 5; // Right Wheel Power
    int rightDir = 7; // Right Wheel Direction
    int pwmLeft = 6; // Left Wheels Power
    int leftDir = 8; // Left Wheel Direction
    float pwmVal = 100; // Control Power (Speed)

    float linearVel;
    float angularVel;

    // PWM calculation for linearVel and angularVel
    float calcLinearPWM(float linearVel);
    float calcAngularPWM(float angularVel);

  public:
    // Constructor
    carBase(float linVel = 1.25, float angVel = 180);

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
    void turnCalib();

    // Get variables
    float getLinearVel() { return linearVel; }
    float getAngularVel() { return angularVel; };

    // Set variables
    void setLinearVel(float vel);
    void setAngularVel(float vel);

};

#endif