import os
import modal

# 1. Define the Modal App
app = modal.App("carvona-backend")

# 2. Define the container image with all backend dependencies
# We pre-download the weights during the build phase so they are cached and boot instantly
def download_weights():
    weights_path = "/root/license_plate_keypoint.pt"
    if not os.path.exists(weights_path):
        import requests
        url = "https://huggingface.co/PrasannaBAImodel/license-plate-keypoint-detection/resolve/main/license_plate_keypoint.pt"
        print("Downloading YOLOv8 model weights...")
        r = requests.get(url, stream=True)
        r.raise_for_status()
        with open(weights_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
        print("Model weights saved.")

image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install(
        "fastapi==0.111.0",
        "uvicorn==0.30.1",
        "python-multipart==0.0.9",
        "ultralytics==8.4.92",
        "opencv-python-headless==4.9.0.80",
        "numpy==1.26.4",
        "torch==2.3.1",
        "requests==2.32.3"
    )
    .run_function(download_weights)
    .add_local_file("main.py", remote_path="/root/main.py")
)

# 3. Serve the FastAPI app as an ASGI application
# This exposes all /api/detect and /api/process routes automatically on Modal!
@app.function(
    image=image,
    cpu=2.0,
    memory=2048
)
@modal.asgi_app()
def fastapi_app():
    # Set working directory to load weights correctly
    os.chdir("/root")
    from main import app as fastapi_app
    return fastapi_app
