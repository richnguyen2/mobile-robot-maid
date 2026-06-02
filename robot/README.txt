Repository Structure:
robot/
├── firmware/
├── localization/
├── perception/
├── planning/

firmware/
    Arduino code for motor drivers and sensors

perception/
    Camera calibration, rectification, depth estimation

planning/
    Navigation and decision-making algorithms

control/
    Motion commands and robot behaviors


Recommended setup:

1. Create a virtual environment:

python3 -m venv .venv

2. Activate the virtual environment:

source .venv/bin/activate

3. Install dependencies:

pip install --upgrade pip
pip install -r requirements.txt
