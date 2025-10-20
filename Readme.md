# 🚀 Sigma Web Development Course - RAG AI Teaching Assistant

An intelligent AI-powered teaching assistant for the Sigma Web Development Course, featuring a premium landing page and RAG (Retrieval-Augmented Generation) system.

## ✨ Features

- 🤖 **AI Teaching Assistant** - Get instant answers about course content
- 🎯 **Smart Search** - Find exactly which video and timestamp covers any topic
- 🎨 **Premium Landing Page** - Professional, responsive design
- ⚡ **Fast Responses** - Powered by LLM and all-MiniLM-L6-v2 embeddings
- 📹 **Video Integration** - Direct links to relevant course sections

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Flask (Python)
- **AI Models**: 
  - all-MiniLM-L6-v2 (Embeddings via sentence-transformers)
  - Llama 3.1 / Groq (Language Model via Groq API)
  - Whisper (Speech-to-Text)
- **Vector Search**: Scikit-learn (Cosine Similarity)
- **Storage**: Joblib (Pickle)

## 📋 Prerequisites

1. **Python 3.8+**
2. Embeddings
   - This project uses `sentence-transformers/all-MiniLM-L6-v2` for embeddings by default.
   - To re-create embeddings locally run:
     ```bash
     python scripts/reembed_from_jsons.py
     ```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Prepare Your Data

#### Step 1: Collect Videos
Move all your video files to the `videos` folder

#### Step 2: Convert to MP3
```bash
python video_to_mp3.py
```

#### Step 3: Convert MP3 to JSON (Speech-to-Text)
```bash
python mp3_to_json.py
```

#### Step 4: Create Embeddings
```bash
python preprocess_json.py
```
This will create `embeddings.joblib` file

### 3. Start the Backend API

```bash
python app.py
```
Server will run on `http://localhost:5000`

### 4. Open the Landing Page

Simply open `index.html` in your browser or use a local server:

```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

## 📁 Project Structure

```
RagBasedAi/
├── index.html           # Landing page
├── style.css            # Styling
├── script.js            # Frontend JavaScript
├── app.py              # Flask API server
├── process_incoming.py  # CLI version
├── preprocess_json.py   # Create embeddings
├── mp3_to_json.py      # Speech-to-text
├── video_to_mp3.py     # Video conversion
├── jsons/              # Transcribed content
├── requirements.txt     # Python dependencies
└── embeddings.joblib   # Vector database
```

## 🎯 How It Works

1. **Video Processing**: Videos → MP3 → JSON (using Whisper AI)
2. **Embedding Creation**: Text chunks → Vector embeddings (all-MiniLM-L6-v2)
3. **User Query**: Question → Embedding
4. **Similarity Search**: Find top 5 relevant chunks (Cosine Similarity)
5. **AI Response**: Context + Query → Llama 3.1 (via Groq) → Natural answer

## 🌐 Using the Landing Page

1. Open `index.html` in your browser
2. Navigate to the "AI Assistant" section
3. Type your question about the course
4. Get instant answers with video numbers and timestamps!

## 💡 Example Questions

- "How do websites work?"
- "Where is CSS taught?"
- "What are HTML entities?"
- "When is JavaScript introduced?"

## 🔧 API Endpoints

### POST `/ask`
Ask a question to the AI assistant

**Request:**
```json
{
  "question": "How do websites work?"
}
```

**Response:**
```json
{
  "response": "AI generated answer...",
  "question": "How do websites work?",
  "sources": [...]
}
```

### GET `/health`
Check system status

## 🐛 Troubleshooting

### Troubleshooting
- If embeddings are missing, run `python scripts/reembed_from_jsons.py` to regenerate `embeddings.joblib` locally.

### No Embeddings Found
- Run `preprocess_json.py` first
- Ensure `jsons/` folder has content
- Check `embeddings.joblib` exists

### CORS Error
- Make sure Flask backend is running
- Check `flask-cors` is installed

## 📝 License

MIT License - Feel free to use for your own courses!

## 👨‍💻 Author

Sigma Web Development Course Team

---

**Made with ❤️ using RAG AI Technology**


