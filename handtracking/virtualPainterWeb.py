import json
import math
import cv2
import numpy as np
import handTrackingModule as handTrackingModule
from flask import Flask, render_template, Response, request, jsonify
from flask_cors import CORS
print("running")
########################################################################################################################
brushThickness = 10
eraserThickness = 30
selectedThickness = brushThickness
maxThickness = 100
minThickness = 1
lastDrawColor = (1, 1, 1)
currentDrawColor = lastDrawColor
eraseColor = (0, 0, 0)
cameraWidth = 640
cameraHeight = 480
drawing = False  # Initialize drawing state
brushing = True  # Initialize brushing state
erasing = False  # Initialize erasing state
resizing = False  # Initialize resizing state
colorPicking = False  # Initialize color picking state
imgCanvas = np.zeros((cameraHeight, cameraWidth, 3), np.uint8)  # Initialize blank canvas
########################################################################################################################

# Create a Flask application object — app — in the current Python module
app = Flask(__name__)
# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


def generate_frames():
    print("generating frames")
    global brushThickness, eraserThickness, selectedThickness, lastDrawColor, currentDrawColor, imgCanvas, hue_width, hue_height, hue_image_opacity

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Turn your webcam on!")
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, cameraWidth)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, cameraHeight)
    detector = handTrackingModule.handDetector(maxHands=1, detectionConfidence=0.85)
    xp, yp = 0, 0

    ####################################################################################################################
    # Hue display settings
    hue_image = cv2.imread("hue.png")
    if hue_image is None:
        print("Error loading hue.png")
    else:
        # Resize the hue image to fit within the camera image if needed
        hue_image = cv2.resize(hue_image, (cameraWidth, cameraHeight // 20), interpolation=cv2.INTER_AREA)
        hue_image_opacity = 1
        hue_height = hue_image.shape[0]
        hue_width = hue_image.shape[1]
    ####################################################################################################################

    while True:
        # 1: Capture img from camera (640x480)
        success, img = cap.read()
        img = cv2.flip(img, 1)

        # 2: Find hand landmarks in the original 640x480 frame
        img = detector.findHands(img)
        landmark_list = detector.findPosition(img)
        if len(landmark_list) != 0:
            index_x, index_y = landmark_list[8][1:]  # Get landmark for index finger (landmark 8)
            thumb_x, thumb_y = landmark_list[4][1:]  # Get landmark for thumb (landmark 4)

            cv2.circle(img, (index_x, index_y), int(selectedThickness // 2), currentDrawColor, 2)
            if drawing:
                cv2.line(imgCanvas, (xp, yp), (index_x, index_y), currentDrawColor, int(selectedThickness))
            elif resizing:
                if currentDrawColor == (0, 0, 0):
                    cv2.line(img, (index_x, index_y), (thumb_x, thumb_y), eraseColor, 3)
                    length = math.hypot(index_x - thumb_x, index_y - thumb_y)
                    print("Eraser thickness: " + str(length))
                    eraserThickness = length
                    selectedThickness = eraserThickness
                else:
                    cv2.line(img, (index_x, index_y), (thumb_x, thumb_y), currentDrawColor, 3)
                    length = math.hypot(index_x - thumb_x, index_y - thumb_y)
                    print("Brush thickness: " + str(length // 2))
                    brushThickness = length // 2
                    selectedThickness = brushThickness
            elif colorPicking:
                if currentDrawColor == eraseColor:  # Current color is black (eraser color)
                    print("Color picking is disabled while erasing.")
                else:
                    # Calculate the corresponding x-coordinate in the hue_image
                    hue_x = int((index_x / cameraWidth) * hue_width)

                    # Get the color from the hue image at the specified hue_x
                    # Ensure that the pixel accessed is within the bounds of the hue_image
                    if hue_x < hue_image.shape[1]:  # Check if hue_x is within the width of the image
                        # Access the pixel value at (0, hue_x) and convert it to a tuple of integers
                        lastDrawColor = tuple(int(c) for c in hue_image[0, hue_x])  # Set the RGB color
                        currentDrawColor = lastDrawColor
                        print(f"Color picked: {currentDrawColor}")
                    else:
                        print("hue_x is out of bounds!")

            # Update the previous points for the next line segment
            xp, yp = index_x, index_y

        # Create a grayscale version of the canvas for combining
        imgGray = cv2.cvtColor(imgCanvas, cv2.COLOR_BGR2GRAY)
        _, imgInv = cv2.threshold(imgGray, 0, 255, cv2.THRESH_BINARY_INV)
        imgInv = cv2.cvtColor(imgInv, cv2.COLOR_GRAY2BGR)

        # Combine the camera feed and the canvas
        img = cv2.bitwise_and(img, imgInv)  # Remove drawing from the img where there is canvas drawing
        img = cv2.bitwise_or(img, imgCanvas)  # Add the canvas drawing to the img

        if hue_image is not None and colorPicking:
            # Create an overlay, where the hue image will only span a portion of the canvas
            img[0:0 + hue_height, 0:0 + hue_width] = cv2.addWeighted(
                img[0:0 + hue_height, 0:0 + hue_width], 0, hue_image, hue_image_opacity, 0)

        # Create a larger window for drawing
        # imgLarge = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)

        _, buffer = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        frame = buffer.tobytes()
        yield b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'


def clear_canvas():
    global imgCanvas, drawing
    imgCanvas = np.zeros((cameraHeight, cameraWidth, 3), np.uint8)
    drawing = False
    print("Clear canvas")

def toggle_draw():
    global drawing, resizing, colorPicking
    drawing = not drawing
    resizing = False
    colorPicking = False
    print("Drawing:", drawing)

def brush_tool():
    global selectedThickness, currentDrawColor, drawing
    selectedThickness = brushThickness
    currentDrawColor = lastDrawColor
    drawing = False
    print("Brush mode, thickness:", selectedThickness)

def eraser_tool():
    global selectedThickness,currentDrawColor, drawing
    selectedThickness = eraserThickness
    currentDrawColor = eraseColor
    drawing = False
    print("Eraser mode, thickness:", selectedThickness)

def toggle_resizing():
    global resizing, drawing, colorPicking
    resizing = not resizing
    drawing = False
    colorPicking = False
    print("Toggle resizing:", resizing)

def toggle_color_picking():
    global colorPicking, drawing, resizing
    colorPicking = not colorPicking
    drawing = False
    resizing = False
    brush_tool()
    print("Color picking mode:", colorPicking)

def save_img():
    canvas_copy = imgCanvas.copy()
    # Convert all black pixels to white
    canvas_copy[np.all(canvas_copy == [0, 0, 0], axis=-1)] = [255, 255, 255]
    cv2.imwrite("canvas_output.png", canvas_copy)
    print("Canvas saved as 'canvas_output.png'")

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def load_hotkeys(config_path="hotkeys.json"):
    with open(config_path, 'r') as f:
        return json.load(f)
hotkeys = load_hotkeys()

@app.route('/key_press', methods=['POST'])
def key_press():
    global drawing, resizing, erasing, selectedThickness, brushThickness, eraserThickness, currentDrawColor, lastDrawColor, drawing, brushing, erasing, resizing, colorPicking, imgCanvas

    data = request.json
    key = data.get('key')

    if key == hotkeys['clear_canvas']:  # Clear the canvas
        clear_canvas()
    if key == hotkeys['toggle_draw']:  # Toggle drawing mode
        toggle_draw()
    if key == hotkeys['brush_tool']:  # Brush mode
        brush_tool()
    if key == hotkeys['eraser_tool']:  # Eraser mode
        eraser_tool()
    if key == hotkeys['toggle_resizing']:  # Resize mode
        toggle_resizing()
    if key == hotkeys['toggle_color_picking']:  # Color picking mode
        toggle_color_picking()
    if key == hotkeys['save_image']:  # Save canvas (Enter key)
        save_img()

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(port=5000)