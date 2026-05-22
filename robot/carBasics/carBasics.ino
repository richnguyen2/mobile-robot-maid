#include "car_movement.h"
#include "IR_Controller.h"
#include "ultrasonic_sensor.h"

carBase myCar;
IRcontroller remote(myCar);
ultrasonicSensor distanceSensor;
int delayTime = 1000;
float measDist;

void setup() {
  Serial.begin(9600);
  myCar.begin();
  remote.begin();
  distanceSensor.begin();
  delay(delayTime);
}

void loop() {
  myCar.moveForward(10);
  while (true) {
    measDist = distanceSensor.findDistance();
    myCar.update(measDist);   
  }
}