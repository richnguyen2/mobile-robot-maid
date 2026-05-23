#ifndef IR_CONTROLLER_H
#define IR_CONTROLLER_H

#include "car_movement.h"
#include <Arduino.h>

class IRcontroller {
  private:
    carBase &car; // reference to existing car object
  
  public:
    IRcontroller(carBase &robotCar);

    void begin();
    void checkRemote();
};

#endif