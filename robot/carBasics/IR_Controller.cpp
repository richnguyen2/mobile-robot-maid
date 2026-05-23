#include "IR_Controller.h"
#include <IRremote.h>

static IRrecv IR(9);
static decode_results cmd;

#define BTN_UP 0xFF629D
#define BTN_DOWN 0xFFA857
#define BTN_RIGHT 0xFFC23D
#define BTN_LEFT 0xFF22DD

IRcontroller::IRcontroller(carBase &robotCar) 
  : car(robotCar)
{}

void IRcontroller::begin() {
  IR.enableIRIn();
}

void IRcontroller::checkRemote() {
  if (IR.decode(&cmd)) {
    Serial.println();
    Serial.print(cmd.value, HEX);

    if (cmd.value == BTN_UP) {
      car.moveForward(1);
    } else if (cmd.value == BTN_DOWN) {
      car.moveBackward(1);
    } else if (cmd.value == BTN_RIGHT) {
      car.turnRight(90);
    } else if (cmd.value == BTN_LEFT) {
      car.turnLeft(90);
    }

  IR.resume(); // Reset IR Receiver and ready to listen to signal again
  }
}