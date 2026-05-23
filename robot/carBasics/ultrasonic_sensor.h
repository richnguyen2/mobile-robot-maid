#ifndef ULTRASONIC_SENSOR_H
#define ULTRASONIC_SENSOR_H

class ultrasonicSensor {
  private:
    static constexpr int trigPin = 13;
    static constexpr int echoPin = 12;
  
  public:
    void begin();
    float findDistance();
};

#endif