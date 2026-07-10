# Carvona - AI Automotive Image Editor

Carvona is an AI-powered automotive image processing application. Automatically detect license plates using a fine-tuned YOLOv8-pose keypoint model to blur them for privacy or brand them with your custom dealership logo.

---

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI + YOLOv8)
1. Initialize python environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Download model weights:
   ```bash
   python download_model.py
   ```
3. Start local Uvicorn FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```

### 2. Frontend Setup (Next.js)
1. Install Node modules:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## ☁️ Cloud Deployment (Vercel + Modal.com)

This application is split into a serverless Next.js frontend (deployed on Vercel) and a serverless Python GPU/CPU worker (deployed on Modal.com).

### 1. Deploy AI Backend on Modal.com
1. Install Modal:
   ```bash
   pip install modal
   ```
2. Login and authenticate your workspace:
   ```bash
   modal setup
   ```
3. Deploy the application:
   ```bash
   modal deploy modal_app.py
   ```
4. Copy the deployment web URL generated (e.g. `https://prasannab4362--carvona-backend-fastapi-app.modal.run`).

### 2. Deploy Frontend on Vercel
1. Import your repository into Vercel.
2. In Vercel Project Settings -> **Environment Variables**, add:
   - **Key**: `BACKEND_URL`
   - **Value**: `https://prasannab4362--carvona-backend-fastapi-app.modal.run` (your Modal URL)
3. Deploy the frontend. Next.js will automatically proxy all API requests to the serverless Modal endpoints!
