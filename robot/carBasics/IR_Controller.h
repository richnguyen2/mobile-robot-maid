#ifndef IR_CONTROLLER_H
#define IR_CONTROLLER_H

#include "car_movement.h"
#include <IRremote.h>

class IRcontroller {
  private:
    decode_results cmd;
    IRrecv IR;
    carBase &car; // reference to existing car object
  
  public:
    IRcontroller(carBase &robotCar);

    void begin();
    void checkRemote();
};

#endif