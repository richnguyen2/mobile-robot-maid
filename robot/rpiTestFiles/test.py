import serial
import time

arduinoData = serial.Serial('COM5', 115200, timeout=2)

time.sleep(2)

cmdList = ["forward", "turn_right", "turn_left"]
for cmdVal in cmdList:
    # Send Command to Arduino
    cmd = cmdVal + '\r'
    print(cmd)
    arduinoData.write(cmd.encode())

    msg = arduinoData.readline().decode().strip()

    if msg:
        print("Distance:", msg)
    else:
        print(msg)
        print("Timed out")
        