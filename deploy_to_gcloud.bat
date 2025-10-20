@echo off
echo ========================================
echo 🚀 Deploying RAG AI Backend to Google Cloud Run
echo ========================================

echo.
echo 📋 Step 1: Setting up Google Cloud CLI...
gcloud auth login
gcloud config set project brilliant-flame-475104-c2

echo.
echo 📋 Step 2: Building and pushing Docker image...
gcloud builds submit --tag gcr.io/brilliant-flame-475104-c2/rag-ai-backend

echo.
echo 📋 Step 3: Deploying to Cloud Run with environment variables...
gcloud run deploy rag-ai-backend ^
  --image gcr.io/brilliant-flame-475104-c2/rag-ai-backend ^
  --platform managed ^
  --region asia-south1 ^
  --allow-unauthenticated ^
  --set-env-vars GROQ_API_KEY=%GROQ_API_KEY%
  --memory 2Gi ^
  --cpu 2 ^
  --timeout 300 ^
  --max-instances 10

echo.
echo ✅ Deployment complete!
echo 🌐 Your backend will be available at:
echo https://rag-ai-backend-207455190663.asia-south1.run.app
echo.
echo 🧪 Test the health endpoint:
echo https://rag-ai-backend-207455190663.asia-south1.run.app/health
echo.
pause

