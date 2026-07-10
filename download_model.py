import os
import requests
import sys

MODEL_URL = "https://huggingface.co/PrasannaBAImodel/license-plate-keypoint-detection/resolve/main/license_plate_keypoint.pt"
MODEL_PATH = "license_plate_keypoint.pt"

def download_model():
    if os.path.exists(MODEL_PATH):
        print(f"Model file '{MODEL_PATH}' already exists. Skipping download.")
        return

    print(f"Downloading model from {MODEL_URL}...")
    try:
        response = requests.get(MODEL_URL, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(MODEL_PATH, 'wb') as file:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    file.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        sys.stdout.write(f"\rProgress: {percent:.1f}% ({downloaded / (1024*1024):.1f}MB / {total_size / (1024*1024):.1f}MB)")
                        sys.stdout.flush()
        print("\nDownload complete! Model saved successfully.")
    except Exception as e:
        print(f"\nError downloading model: {e}")
        # Clean up partial download
        if os.path.exists(MODEL_PATH):
            os.remove(MODEL_PATH)
        sys.exit(1)

if __name__ == "__main__":
    download_model()
