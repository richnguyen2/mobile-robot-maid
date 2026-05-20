#include "car_movement.h"
#include <Arduino.h>

// Constructor for base car class
carBase::carBase(float linVel, float angVel) {
  linearVel = linVel;
  angularVel = angVel; 
}

// Pin setup
void carBase::begin() {
  pinMode(STBY, OUTPUT);
  pinMode(pwmRight, OUTPUT);
  pinMode(pwmLeft, OUTPUT);
  pinMode(rightDir, OUTPUT);
}

// Calculate PWM value based on linear velocity
float carBase::calcLinearPWM(float linVel) {
  float val = (linVel - .01)/.0124; // linear calibration of linear velocity and PWM
  return val;
}

// Calculate PWM value based on angular velocity
float carBase::calcAngularPWM(float angVel) {
  float val = (angVel + 55.8)/2.258;  // calibration of angular velocity and PWM
  return val;
}

void carBase::setLinearVel(float vel) {
  if ((vel > 1.25) & (vel < 3.16)) {
    linearVel = vel;
    Serial.print("\nUpdated Linear Vel: ");
    Serial.print(linearVel);
  } else {
    // No Change
    Serial.print("\nInvalid linear velocity update value, no change");
  }
}

void carBase::moveForward(float distance, float linVel) {
  float time = (distance/linVel) * 1000;
  digitalWrite(STBY, HIGH);
  digitalWrite(rightDir, HIGH);
  digitalWrite(leftDir, HIGH);

  float val = calcLinearPWM(linVel);
  analogWrite(pwmLeft, val);
  analogWrite(pwmRight, val);

  delay(time);

  digitalWrite(STBY, LOW);
  Serial.print("\nForward, Dis: ");
  Serial.print(distance);
  Serial.print(" Vel: ");
  Serial.print(linVel);
  Serial.print(" PWM_Val: ");
  Serial.print(val);
}

// Move forward using stored velocity
void carBase::moveForward(float distance) {
  moveForward(distance, linearVel);
}

void carBase::moveBackward(float distance, float linVel) {
  float time = (distance/linVel) * 1000;
  digitalWrite(STBY, HIGH);
  digitalWrite(rightDir, LOW);
  digitalWrite(leftDir, LOW);

  float val = calcLinearPWM(linVel);
  analogWrite(pwmLeft, val);
  analogWrite(pwmRight, val);

  delay(time);

  digitalWrite(STBY, LOW);
  Serial.print("\nBackward, Dis: ");
  Serial.print(distance);
  Serial.print(" Vel: ");
  Serial.print(linVel);
  Serial.print(" PWM_Val: ");
  Serial.print(val);
}

// Move backward using stored velocity
void carBase::moveBackward(float distance) {
  moveBackward(distance, linearVel);
}

void carBase::turnRight(float angle, float angVel) {
  float time = (angle/angVel) * 1000;
  digitalWrite(STBY, HIGH);
  digitalWrite(rightDir, LOW);
  digitalWrite(leftDir, HIGH);

  float val = calcAngularPWM(angVel);
  analogWrite(pwmLeft, val);
  analogWrite(pwmRight, val);

  delay(time);

  digitalWrite(STBY, LOW);
  Serial.print("\nTurn Right, Angle: ");
  Serial.print(angle);
  Serial.print(" AngVel(degree/s)): ");
  Serial.print(angVel);
  Serial.print(" PWM_Val: ");
  Serial.print(val);
}

void carBase::turnRight(float angle) {
  turnRight(angle, angularVel);
}

void carBase::turnLeft(float angle, float angVel) {
  float time = (angle/angVel) * 1000;
  digitalWrite(STBY, HIGH);
  digitalWrite(rightDir, HIGH);
  digitalWrite(leftDir, LOW);

  float val = calcAngularPWM(angVel);
  analogWrite(pwmLeft, val);
  analogWrite(pwmRight, val);

  delay(time);

  digitalWrite(STBY, LOW);
  Serial.print("\nTurn Left, Angle: ");
  Serial.print(angle);
  Serial.print(" AngVel(degree/s)): ");
  Serial.print(angVel);
  Serial.print(" PWM_Val: ");
  Serial.print(val);
}

void carBase::turnLeft(float angle) {
  turnLeft(angle, angularVel);
}
