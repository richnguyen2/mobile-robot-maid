import cv2
import numpy as np
import time

upperLeft = (510, 20) # cv2 does (cols, rows), splicing images is (rows, cols)
lowerRight = (630, 60)
textBottomLeft = (520, 50)
red = (0, 0, 255)
lineW = 2
fontType = cv2.FONT_HERSHEY_PLAIN
fontScale = 1.5
fontThick = 2

# width (cols) = 640, height (rows) = 240
myCam = cv2.VideoCapture(1, cv2.CAP_DSHOW)
myCam.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))

lastT = time.time()
fpsFilter = 30

while True:
    _, frame = myCam.read()  # Read Frame
    grayFrame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    dT = time.time() - lastT
    fps = 1/dT
    #### Code ###



    #############
    fpsFilter = fpsFilter*.9 + fps*.1
    lastT = time.time()
    text = "FPS:" + str(int(fpsFilter))

    print(fpsFilter)
    cv2.rectangle(frame, upperLeft, lowerRight, red, lineW)
    cv2.putText(frame, text, textBottomLeft, fontType, fontScale, red, fontThick)
    cv2.imshow('My WebCam', frame)  # Show Frame
    if cv2.waitKey(1) & 0xff == ord('q'):  # Wait for 1 millisecond if anyone pressed a key
        break

myCam.release()

