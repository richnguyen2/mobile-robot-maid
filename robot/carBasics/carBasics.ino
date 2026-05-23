#include "car_movement.h"
#include "IR_Controller.h"
#include "ultrasonic_sensor.h"

carBase myCar;
IRcontroller remote(myCar);
ultrasonicSensor distanceSensor;

constexpr int TASK_PERIOD_MS = 20;
int lastExecutionTime = 0;

int delayTime = 1000;

float measDist;

void setup() {
  Serial.begin(9600);
  myCar.begin();
  remote.begin();
  distanceSensor.begin();
  delay(delayTime);

  myCar.moveForward(10.0f);
}

void loop() {
  int currentTime = millis();
  if (currentTime - lastExecutionTime >= TASK_PERIOD_MS) {
    lastExecutionTime = currentTime;

    measDist = distanceSensor.findDistance();
    myCar.update(measDist);

  } 
}