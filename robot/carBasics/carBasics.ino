#include "ultrasonic_sensor.h"
#include "mpu6050.h"
#include "motor_driver.h"
#include "navigation_controller.h"


constexpr int TASK_PERIOD_MS = 20;
int lastExecutionTime = 0;

int delayTime = 2000;

MotorDriver motors;
MPU6050 imu;
UltrasonicSensor sonar;

NavigationController nav(&imu, &motors, &sonar);

void setup() {
  Serial.begin(115200);

  motors.begin();
  imu.initialize();
  sonar.begin();
  delay(delayTime);

  nav.command_drive_straight(50.0f);
}

void loop() {
  int currentTime = millis();
  if (currentTime - lastExecutionTime >= TASK_PERIOD_MS) {
    lastExecutionTime = currentTime;
    imu.update();
    sonar.get_distance();

    nav.update();

  } 
}