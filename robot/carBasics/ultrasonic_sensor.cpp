#include "ultrasonic_sensor.h"
#include <Arduino.h>

// Pin setup
void ultrasonicSensor::begin() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

// Max distance detected with sensor is ~5m
float ultrasonicSensor::findDistance() {
  // Tell sensor to send signal
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long pingTime = pulseIn(echoPin, HIGH, 30000); // returns ping time in microseconds
  float pingSeconds = pingTime / 1000000.0;
  float distance = (393. * 39.3700787) * pingSeconds; // convert distance to inches
  distance = distance/2.0;
  return distance;
}