import json
import numpy as np
import cv2
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from ultralytics import YOLO

app = FastAPI(title="Carvona AI Backend")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
current_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(current_dir, "license_plate_keypoint.pt")
model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f"Model file '{MODEL_PATH}' not found. Please run download_model.py first.")
        model = YOLO(MODEL_PATH)
    return model

@app.post("/api/detect")
async def detect_plate(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        h, w, _ = img.shape
        net = get_model()
        results = net(img, conf=0.25, verbose=False)

        for result in results:
            if result.keypoints is not None and len(result.keypoints) > 0:
                # Get the first detected plate keypoints
                kpts = result.keypoints[0].xy[0].cpu().numpy() # Shape [4, 2]
                
                # Check if we have 4 corner points
                if len(kpts) >= 4:
                    # Keypoint order: 0: TL, 1: TR, 2: BR, 3: BL
                    # Normalize points (0 to 1) for frontend responsiveness
                    normalized_kpts = [
                        {"x": float(pt[0] / w), "y": float(pt[1] / h)} for pt in kpts[:4]
                    ]
                    
                    # Compute a default bounding box as well
                    x_coords = [pt[0] for pt in kpts[:4]]
                    y_coords = [pt[1] for pt in kpts[:4]]
                    bbox = {
                        "x": float(min(x_coords) / w * 100),
                        "y": float(min(y_coords) / h * 100),
                        "w": float((max(x_coords) - min(x_coords)) / w * 100),
                        "h": float((max(y_coords) - min(y_coords)) / h * 100)
                    }

                    return {
                        "success": True,
                        "keypoints": normalized_kpts,
                        "bbox": bbox,
                        "confidence": float(result.boxes[0].conf[0].cpu().item())
                    }

        return {"success": False, "message": "No license plate detected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process")
async def process_plate(
    file: UploadFile = File(...),
    mode: str = Form(...), # "blur" or "logo"
    coords: str = Form(...), # JSON string of normalized keypoints [{"x": x, "y": y}, ...]
    # Blur settings
    blur_style: str = Form("pixel"), # "pixel", "smooth", "solid"
    blur_intensity: int = Form(10),
    solid_color: str = Form("#FFFFFF"),
    # Logo settings
    logo_brand: str = Form("carvona"), # "carvona", "premium", "custom"
    logo_file: UploadFile = File(None),
    logo_scale: float = Form(100.0),
    logo_rotate: float = Form(0.0),
    logo_skew_x: float = Form(0.0),
    logo_skew_y: float = Form(0.0)
):
    try:
        # 1. Read input image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid base image file")

        h, w, _ = img.shape
        
        # 2. Parse keypoint coordinates
        try:
            pts_list = json.loads(coords)
            # Map normalized coordinates back to pixel values
            dst_pts = np.array([
                [pt["x"] * w, pt["y"] * h] for pt in pts_list
            ], dtype=np.float32)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid coordinates format")

        if len(dst_pts) < 4:
            raise HTTPException(status_code=400, detail="Require exactly 4 corners (TL, TR, BR, BL)")

        # 3. Apply edits
        if mode == "blur":
            if blur_style == "solid":
                # Parse hex color
                hex_color = solid_color.lstrip("#")
                bgr_color = tuple(int(hex_color[i:i+2], 16) for i in (4, 2, 0)) # BGR format
                
                # Draw filled polygon directly
                cv2.fillPoly(img, [dst_pts.astype(np.int32)], bgr_color)
            
            elif blur_style == "pixel":
                # Create mask for the polygon
                mask = np.zeros((h, w), dtype=np.uint8)
                cv2.fillPoly(mask, [dst_pts.astype(np.int32)], 255)
                
                # Bounding box for cropping the plate area
                x, y, bw, bh = cv2.boundingRect(dst_pts.astype(np.int32))
                x, y = max(0, x), max(0, y)
                bw, bh = min(w - x, bw), min(h - y, bh)
                
                if bw > 0 and bh > 0:
                    plate_crop = img[y:y+bh, x:x+bw]
                    # Calculate downsample factor
                    pixel_size = max(2, int(blur_intensity / 2))
                    temp = cv2.resize(plate_crop, (max(1, bw // pixel_size), max(1, bh // pixel_size)), interpolation=cv2.INTER_LINEAR)
                    pixelated = cv2.resize(temp, (bw, bh), interpolation=cv2.INTER_NEAREST)
                    
                    # Blend pixelated back using the mask
                    img_pixelated = img.copy()
                    img_pixelated[y:y+bh, x:x+bw] = pixelated
                    
                    img = np.where(mask[:, :, None] == 255, img_pixelated, img)

            elif blur_style == "smooth":
                # Create mask
                mask = np.zeros((h, w), dtype=np.uint8)
                cv2.fillPoly(mask, [dst_pts.astype(np.int32)], 255)
                
                # Blur the whole image
                ksize = max(3, blur_intensity * 2 + 1)
                blurred_img = cv2.GaussianBlur(img, (ksize, ksize), 0)
                
                # Blend
                img = np.where(mask[:, :, None] == 255, blurred_img, img)

        elif mode == "logo":
            # 1. Load or generate the logo image
            logo_img = None
            if logo_brand == "custom" and logo_file is not None:
                logo_contents = await logo_file.read()
                logo_nparr = np.frombuffer(logo_contents, np.uint8)
                logo_img = cv2.imdecode(logo_nparr, cv2.IMREAD_UNCHANGED)
            
            if logo_img is None:
                # Generate a high-quality stylized brand logo dynamically on canvas
                # We can draw it as a numpy array
                logo_w, logo_h = 1200, 400
                logo_img = np.zeros((logo_h, logo_w, 4), dtype=np.uint8)
                
                # Set background color
                bg_color = (74, 163, 22, 255) if logo_brand == "carvona" else (55, 41, 31, 255) # BGR(A)
                logo_img[:, :] = bg_color
                
                text = "CARVONA" if logo_brand == "carvona" else "PREMIUM MOTORS"
                font = cv2.FONT_HERSHEY_SIMPLEX
                
                if logo_brand == "carvona":
                    # Draw Stylized Circular Car Logo Icon + CARVONA Text next to each other
                    font_scale = 3.0
                    thickness = 8
                    
                    # Get text size
                    (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, thickness)
                    
                    # Total width of: icon (diameter 220) + spacing (60) + text_w
                    total_w = 220 + 60 + text_w
                    start_x = (logo_w - total_w) // 2
                    
                    icon_x = start_x + 110 # Center of circle
                    icon_y = 200
                    
                    # 1. Draw outer circle ring (white)
                    cv2.circle(logo_img, (icon_x, icon_y), 100, (255, 255, 255, 255), 8, cv2.LINE_AA)
                    cv2.circle(logo_img, (icon_x, icon_y), 88, (255, 255, 255, 80), 2, cv2.LINE_AA)
                    
                    # 2. Draw car front outline inside circle
                    # Roof/Windshield
                    windshield_pts = np.array([
                        [icon_x - 35, icon_y - 8],
                        [icon_x + 35, icon_y - 8],
                        [icon_x + 22, icon_y - 32],
                        [icon_x - 22, icon_y - 32]
                    ], dtype=np.int32)
                    cv2.polylines(logo_img, [windshield_pts], True, (255, 255, 255, 255), 4, cv2.LINE_AA)
                    
                    # Hood line
                    cv2.line(logo_img, (icon_x - 50, icon_y - 8), (icon_x + 50, icon_y - 8), (255, 255, 255, 255), 4, cv2.LINE_AA)
                    
                    # Side contour
                    cv2.line(logo_img, (icon_x - 50, icon_y - 8), (icon_x - 54, icon_y + 20), (255, 255, 255, 255), 4, cv2.LINE_AA)
                    cv2.line(logo_img, (icon_x + 50, icon_y - 8), (icon_x + 54, icon_y + 20), (255, 255, 255, 255), 4, cv2.LINE_AA)
                    
                    # Grille outline
                    cv2.rectangle(logo_img, (icon_x - 30, icon_y + 8), (icon_x + 30, icon_y + 30), (255, 255, 255, 255), 3, cv2.LINE_AA)
                    # Grille vertical bars
                    for gr_x in range(icon_x - 18, icon_x + 25, 12):
                        cv2.line(logo_img, (gr_x, icon_y + 8), (gr_x, icon_y + 30), (255, 255, 255, 255), 2, cv2.LINE_AA)
                    
                    # Headlights
                    cv2.circle(logo_img, (icon_x - 44, icon_y + 12), 8, (255, 255, 255, 255), -1, cv2.LINE_AA)
                    cv2.circle(logo_img, (icon_x + 44, icon_y + 12), 8, (255, 255, 255, 255), -1, cv2.LINE_AA)
                    
                    # Bumper bar
                    cv2.line(logo_img, (icon_x - 58, icon_y + 36), (icon_x + 58, icon_y + 36), (255, 255, 255, 255), 6, cv2.LINE_AA)
                    
                    # 3. Draw text next to the icon
                    text_x = start_x + 220 + 60
                    text_y = (logo_h + text_h) // 2
                    
                    # Draw shadow
                    cv2.putText(logo_img, text, (text_x+4, text_y+4), font, font_scale, (0, 0, 0, 255), thickness, cv2.LINE_AA)
                    # Draw white text
                    cv2.putText(logo_img, text, (text_x, text_y), font, font_scale, (255, 255, 255, 255), thickness, cv2.LINE_AA)
                else:
                    # Default centered text for non-carvona default logos
                    font_scale = 3.2
                    thickness = 8
                    (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, thickness)
                    text_x = (logo_w - text_w) // 2
                    text_y = (logo_h + text_h) // 2
                    
                    cv2.putText(logo_img, text, (text_x+4, text_y+4), font, font_scale, (0, 0, 0, 255), thickness, cv2.LINE_AA)
                    cv2.putText(logo_img, text, (text_x, text_y), font, font_scale, (255, 255, 255, 255), thickness, cv2.LINE_AA)

            # Ensure logo has alpha channel
            if logo_img.shape[2] == 3:
                logo_img = cv2.cvtColor(logo_img, cv2.COLOR_BGR2BGRA)

            # Calculate midpoints for adjustments
            center = np.mean(dst_pts, axis=0)
            
            # Apply adjustments (scale, rotate, skew)
            scale = logo_scale / 100.0
            angle_rad = np.radians(logo_rotate)
            
            # Rotation matrix
            cos_a, sin_a = np.cos(angle_rad), np.sin(angle_rad)
            rot_matrix = np.array([[cos_a, -sin_a], [sin_a, cos_a]])
            
            # Skew transform matrix
            skew_matrix = np.array([
                [1.0, np.tan(np.radians(logo_skew_x))],
                [np.tan(np.radians(logo_skew_y)), 1.0]
            ])

            # Apply local transformations around logo center
            adjusted_dst = []
            for i, pt in enumerate(dst_pts):
                # Translate to local coordinate space (centered)
                local_pt = pt - center
                # Scale
                local_pt = local_pt * scale
                # Rotate
                local_pt = np.dot(rot_matrix, local_pt)
                # Skew
                local_pt = np.dot(skew_matrix, local_pt)
                # Translate back
                adjusted_dst.append(local_pt + center)
            
            adjusted_dst = np.array(adjusted_dst, dtype=np.float32)

            # Logo original size
            lh, lw, _ = logo_img.shape

            # Bounding box of destination points
            x_rect, y_rect, bw, bh = cv2.boundingRect(adjusted_dst.astype(np.int32))
            
            # Anti-aliasing downsampling: If the logo image is much larger than the target area, 
            # downsample with cv2.INTER_AREA to avoid jagged/aliased pixels.
            target_w = max(10, int(bw * 2))
            target_h = max(10, int(bh * 2))
            if lw > target_w or lh > target_h:
                logo_img = cv2.resize(logo_img, (target_w, target_h), interpolation=cv2.INTER_AREA)
                lh, lw, _ = logo_img.shape

            # Define perspective source coordinates
            src_pts = np.array([
                [0, 0],         # TL
                [lw - 1, 0],     # TR
                [lw - 1, lh - 1], # BR
                [0, lh - 1]      # BL
            ], dtype=np.float32)

            # Compute Homography
            M = cv2.getPerspectiveTransform(src_pts, adjusted_dst)

            # Warp logo image to fit plate coordinates on base image (using INTER_CUBIC for clean edges)
            warped_logo = cv2.warpPerspective(logo_img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))

            # Extract color and alpha mask
            warped_color = warped_logo[:, :, :3]
            warped_alpha = warped_logo[:, :, 3] / 255.0

            # Alpha blend the logo onto the original image
            for c in range(3):
                img[:, :, c] = (warped_alpha * warped_color[:, :, c] + (1 - warped_alpha) * img[:, :, c]).astype(np.uint8)

        # 4. Encode result image
        _, buffer = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 95])
        return Response(content=buffer.tobytes(), media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
