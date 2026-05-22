#ifndef ULTRASONIC_SENSOR_H
#define ULTRASONIC_SENSOR_H

class ultrasonicSensor {
  private:
    int trigPin = 13;
    int echoPin = 12;
  
  public:
    void begin();
    float findDistance();
};

#endif