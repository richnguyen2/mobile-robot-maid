#include "car_movement.h"
#include "IR_Controller.h"

carBase myCar;
IRcontroller remote(myCar);
int delayTime = 1000;
char cmd;

void setup() {
  Serial.begin(9600);
  myCar.begin();
  remote.begin();
  delay(delayTime);
}

void loop() {
  while (Serial.available()==0) {

  }
  cmd=Serial.read();

  if (cmd=='f') {
    myCar.moveForward(1);
  }
  if (cmd=='b') {
    myCar.moveBackward(1);
  }
  if (cmd=='r') {
    myCar.turnRight(90);
  }
  if (cmd=='l') {
    myCar.turnLeft(90);
  }
  //while (true) {   
  //}
}