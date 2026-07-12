# Carvona - AI Automotive Image Editor

Carvona is an AI-powered automotive image processing application. It automatically detects license plates using a fine-tuned YOLOv8-pose keypoint model to blur them for privacy or brand them with your custom dealership logo.

This codebase is split into a **Next.js frontend** and a **FastAPI backend**:
- **Frontend** (`frontend/`): Next.js web application designed to be deployed on Vercel.
- **Backend** (`backend/`): FastAPI application with YOLOv8 keypoint detection, designed to be deployed on Modal.com.

---

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI + YOLOv8)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize python environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Download YOLO model weights:
   ```bash
   python download_model.py
   ```
5. Start local Uvicorn FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```

### 2. Frontend Setup (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the app. All API requests are automatically proxied to the local backend running at `http://127.0.0.1:8000`.

---

## ☁️ Cloud Deployment

### 1. Backend on Modal.com
1. Install Modal in your python environment:
   ```bash
   pip install modal
   ```
2. Authenticate your Modal account:
   ```bash
   modal setup
   ```
3. Deploy the backend application:
   ```bash
   cd backend
   modal deploy modal_app.py
   ```
4. Note the deployment web URL generated (e.g., `https://<username>--carvona-backend-fastapi-app.modal.run`).

### 2. Frontend on Vercel
1. Import your repository into Vercel.
2. In Vercel Project Settings:
   - Set **Root Directory** to `frontend`.
   - Add the following **Environment Variable**:
     - **Key**: `BACKEND_URL`
     - **Value**: `https://<username>--carvona-backend-fastapi-app.modal.run` (your Modal URL from above)
3. Deploy! Next.js will automatically proxy all API requests to your Modal backend.
