from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd 
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 
import joblib 
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Ensure Flask returns unicode characters (don't escape non-ASCII as \uXXXX)
app.config['JSON_AS_ASCII'] = False
# Enable CORS for Vercel frontend and local development
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://*.vercel.app",
    "https://your-app.vercel.app",  # Replace with your actual Vercel URL
    # Deployed frontend origin (exact) - add yours below
    "https://rag-ai-frontend-demo-3c0877i1e-sahilkhk001-8789s-projects.vercel.app",
    # Production Vercel domain (user requested)
    "https://rag-ai-frontend-demo.vercel.app",
    # Also allow the Vercel deployment hostname used in some previews
    "https://rag-ai-frontend-demo-3c0877i1e-sahilkhk001-8789s-projects.vercel.app"
])
# Load embeddings at startup
try:
    df = joblib.load('embeddings.joblib')
    print("✓ Embeddings loaded successfully")
except Exception as e:
    print(f"✗ Error loading embeddings: {e}")
    df = None

# Determine stored embedding dimension (if available)
stored_embedding_dim = None
if df is not None:
    try:
        sample_emb = df['embedding'].iloc[0]
        stored_embedding_dim = len(sample_emb)
        print(f"✓ Stored embeddings dimension detected: {stored_embedding_dim}")
    except Exception as e:
        print(f"⚠️ Could not determine stored embedding dimension: {e}")
        stored_embedding_dim = None

# The lightweight embedding model is expensive to import/initialize (it pulls
# in transformers/torch). We DO NOT import it at module import time to keep
# startup fast and avoid blocking health checks. `create_embedding()` will
# lazy-load the model on first use.
embed_model = None
print("i: Lightweight embedding model will be lazy-loaded on first use")

# We no longer use a mapper or heavy fallback — the dataset should be re-embedded
# using the same lightweight model (see scripts/reembed.py). Ensure embeddings.joblib
# has been created with the same model (all-MiniLM-L6-v2) before deploying.

def create_embedding(text_list):
    """Create embeddings for incoming queries using a lightweight SentenceTransformer.

    The dataset embeddings are already stored in `embeddings.joblib`. We should only
    create embeddings for incoming queries. Using a small model (all-MiniLM-L6-v2)
    reduces latency and memory use compared to heavy models like BGE-M3.
    """
    try:
        global embed_model
        if embed_model is None:
            # Lazy-load if not available at startup
            from sentence_transformers import SentenceTransformer
            embed_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✓ Lightweight embedding model lazy-loaded: all-MiniLM-L6-v2")

        # encode returns numpy array when convert_to_numpy=True
        embeddings = embed_model.encode(text_list, convert_to_numpy=True)
        # Ensure embeddings is a 2D numpy array: shape (n_samples, dim)
        embeddings = np.array(embeddings)
        if embeddings.ndim == 1:
            embeddings = embeddings.reshape(1, -1)

        # If stored embeddings exist, they MUST match the embed_model dim. The project
        # should run scripts/reembed.py to re-embed the dataset with this same model.
        emb_dim = embeddings.shape[1]
        if stored_embedding_dim and emb_dim and emb_dim != stored_embedding_dim:
            print(f"❌ Embedding dim mismatch: runtime dim {emb_dim} != stored dim {stored_embedding_dim}. Please run scripts/reembed.py and redeploy with new embeddings.joblib")
            return None

        return embeddings.tolist()

    except Exception as e:
        print(f"❌ Error creating embeddings (lightweight model): {e}")
        return None


def load_embed_model(force=False):
    """Ensure the lightweight embedding model is loaded. Returns True if loaded."""
    try:
        global embed_model
        if embed_model is not None and not force:
            return True
        # Import and initialize the model (may download weights on first run)
        from sentence_transformers import SentenceTransformer
        embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✓ Lightweight embedding model loaded by load_embed_model()")
        return True
    except Exception as e:
        print(f"❌ Failed to load embedding model: {e}")
        return False

def inference(prompt):
    """Generate response using Groq API (FAST & FREE)"""
    try:
        api_key = os.getenv('GROQ_API_KEY', '')
        
        if not api_key:
            print("❌ No GROQ_API_KEY found in environment")
            print(f"Available env vars: {list(os.environ.keys())[:10]}")
            return None
        
        print(f"✓ GROQ_API_KEY found: {api_key[:15]}...{api_key[-10:]}")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",  # Updated model name (llama3-8b-8192 is deprecated)
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,  # More creative but still focused
            "max_tokens": 500  # Allow longer, more complete answers
        }
        
        print(f"\n🚀 Calling Groq API...")
        print(f"📝 Prompt length: {len(prompt)} characters")
        print(f"📊 Context chunks in prompt: {prompt.count('Course Content:')}")
        
        try:
            r = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
        except requests.exceptions.Timeout:
            print("❌ Groq API request timed out")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ Groq API request failed: {e}")
            return None
        
        print(f"📡 Groq API Status: {r.status_code}")
        
        if r.status_code == 200:
            response = r.json()
            answer = response['choices'][0]['message']['content']
            print(f"✅ Groq Response received! Length: {len(answer)} chars")
            print(f"Preview: {answer[:150]}...")
            return answer.strip()
        else:
            print(f"❌ Groq API Error: {r.status_code}")
            print(f"Response: {r.text}")
            return None
        
    except Exception as e:
        print(f"Inference error: {e}")
        import traceback
        traceback.print_exc()
        return None


@app.route('/ask', methods=['POST'])
def ask_question():
    """Handle question from the frontend"""
    try:
        data = request.json
        incoming_query = data.get('question', '')
        
        if not incoming_query:
            return jsonify({"error": "No question provided"}), 400
        
        if df is None:
            return jsonify({"error": "Embeddings not loaded. Please run preprocess_json.py first."}), 500
        
        # Create embedding for the question
        debug_mode = data.get('debug', False)
        question_embedding = create_embedding([incoming_query])
        
        if question_embedding is None:
            return jsonify({"error": "Failed to create embedding. Ensure the embedding model is available."}), 500
        
        question_embedding = question_embedding[0]
        # If debug_mode requested, return dims for diagnosis
        if debug_mode:
            qdim = len(question_embedding)
            return jsonify({
                "status": "debug",
                "stored_dim": stored_embedding_dim,
                "query_dim": qdim
            })
        
        # Find similarities
        similarities = cosine_similarity(np.vstack(df['embedding']), [question_embedding]).flatten()
        
        # Get top 5 results
        top_results = 5
        max_indx = similarities.argsort()[::-1][0:top_results]
        new_df = df.loc[max_indx]
        
    # (debug) removed stray shell commands that were accidentally inserted here
    # Extract context from the top results
        context_parts = []
        for idx, row in new_df.iterrows():
            text = row['text'].strip()
            if text and len(text) > 20:  # Only include meaningful chunks
                context_parts.append(text)

        # Use all top 5 chunks for better context
        context = '\n\n'.join(context_parts[:5])

        # Build a concise semantic summary from the matched chunks (3-4 sentences)
        def build_semantic_summary(df_rows):
            sentences = []
            for idx, row in df_rows.iterrows():
                text = row['text'].strip()
                if not text:
                    continue
                # split into sentences, keep longer meaningful ones
                for s in text.split('.'):
                    clean = s.strip()
                    if len(clean) > 40 and not any(phrase in clean.lower() for phrase in ['welcome back','so today','hey','guys']):
                        sentences.append(clean)
            if not sentences:
                # fallback: join top chunk texts
                joined = ' '.join([r['text'] for _, r in df_rows.iterrows()][:3])
                return joined[:800]

            # take first 3-5 meaningful sentences and join into a paragraph
            summary = '. '.join(sentences[:4])
            if not summary.endswith('.'):
                summary += '.'
            return summary
        
        # Stronger prompt: instruct the model NOT to prepend 'no course content' boilerplate
        prompt = f"""You are a helpful web development teaching assistant. Use ONLY the Course Content section below to answer the student's question when relevant.

        Course Content:
        {context}

        Student Question: {incoming_query}

        Instructions for the assistant:
        - If the Course Content contains relevant information, answer using that content. Do NOT state "I don't see any course content" or similar phrases if content is present.
        - Do not prepend a generic 'no course content' disclaimer. If content is absent, give a short concise answer and then point to available timestamps.
        - Give a clear, complete answer (3-5 sentences) that explains the concept clearly using the information from the Course Content above. Be specific and educational.
        """
        
        # Save prompt for debugging
        with open("prompt.txt", "w", encoding="utf-8") as f:
            f.write(prompt)
        
        # Get AI response
        ai_answer = inference(prompt)
        # If the LLM responds claiming there was no course content or similar, try to salvage
        if ai_answer:
            low = ai_answer.lower()
            failure_phrases = [
                "don't see any course content",
                "i don't see any course content",
                "no course content",
                "i do not see any course content",
                "there is no course content"
            ]
            if any(p in low for p in failure_phrases):
                # Attempt to robustly remove boilerplate clauses while preserving useful content.
                print("⚠️ LLM returned a 'no content' message — attempting to salvage useful content")
                try:
                    import re
                    cleaned = ai_answer.strip()

                    # Remove long boilerplate phrases that mention missing course content (case-insensitive)
                    patterns = [
                        r'(?i)\b(unfortunately|however)[^\.\n]{0,160}(no|don\'t|do not|there is no|forgot)[^\.\n]{0,160}[\.\n]?',
                        r'(?i)no course content[^\.\n]*[\.\n]?',
                        r'(?i)i do not see any course content[^\.\n]*[\.\n]?',
                        r'(?i)it seems like you forgot to provide the course content[^\.\n]*[\.\n]?'
                    ]
                    for pat in patterns:
                        cleaned = re.sub(pat, ' ', cleaned)

                    # Also remove standalone short failure phrases
                    for fp in failure_phrases:
                        cleaned = re.sub(re.escape(fp), ' ', cleaned, flags=re.I)

                    # Collapse multiple spaces and trim punctuation at ends
                    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
                    cleaned = re.sub(r'^[\-\:\;\,\s]+', '', cleaned)
                    cleaned = re.sub(r'[\-\:\;\,\s]+$', '', cleaned)

                    # If cleaned content is sufficiently long, keep it; otherwise fallback
                    if len(cleaned) > 80:
                        ai_answer = cleaned
                        print("✓ Salvaged LLM answer by removing 'no content' boilerplate")
                    else:
                        print("⚠️ Salvaged content too short after cleanup — will use fallback summary instead")
                        ai_answer = None
                except Exception as e:
                    print(f"❌ Error while trying to salvage LLM answer: {e}")
                    ai_answer = None
        
        # Build the final response with answer + timestamps
            # Always prepare a fallback summary (coherent, human-readable) from top chunks
            def build_fallback_summary(df_rows):
                relevant_sentences = []
                for idx, row in df_rows.iterrows():
                    text = row['text'].strip()
                    if text and len(text) > 30:
                        skip_phrases = ['guys', 'hey', 'so today', 'in this video', 'welcome back', 'so guys']
                        if not any(phrase in text.lower() for phrase in skip_phrases):
                            for sentence in text.split('.'):
                                clean = sentence.strip()
                                if len(clean) > 40:
                                    relevant_sentences.append(clean)
                if relevant_sentences:
                    answer_text = '. '.join(relevant_sentences[:4])
                    if not answer_text.endswith('.'):
                        answer_text += '.'
                    return answer_text
                # Fallback: short pointer to timestamps
                return f"Based on the course content, information about '{incoming_query}' can be found in the video timestamps listed below."

            fallback_summary = build_fallback_summary(new_df)

            # Decide final semantic answer: prefer LLM answer unless it explicitly claimed no content
            semantic_answer = None
            if ai_answer:
                # If the LLM still contains any explicit failure phrase, prefer the fallback summary
                low_ai = ai_answer.lower()
                failure_phrases = [
                    "don't see any course content",
                    "i don't see any course content",
                    "no course content",
                    "i do not see any course content",
                    "there is no course content",
                    "you forgot to provide the course content",
                ]
                if any(fp in low_ai for fp in failure_phrases):
                    print("⚠️ LLM contained a failure phrase in final output — using fallback_summary for semantic_answer")
                    semantic_answer = fallback_summary
                else:
                    semantic_answer = ai_answer
            else:
                semantic_answer = fallback_summary

            # Build evidence list with timestamps and similarity scores (we will keep top 3)
            evidence = []
            for idx, row in new_df.iterrows():
                try:
                    score = float(similarities[idx])
                except Exception:
                    score = 0.0
                start = row.get('start', 0)
                timestamp = f"{int(start // 60)}:{int(start % 60):02d}"
                evidence.append({
                    'title': row.get('title'),
                    'number': int(row.get('number')) if row.get('number') is not None else None,
                    'start': start,
                    'end': row.get('end'),
                    'timestamp': timestamp,
                    'score': score,
                    # keep only very short snippet for display
                    'text_snippet': (row.get('text') or '')[:120]
                })

                # Truncate semantic answer to 5 sentences/lines (neat 4-6 lines)
                def truncate_answer(ans, max_sentences=5):
                    import re
                    # split on sentence boundaries
                    parts = re.split(r'(?<=[.!?])\s+', ans.strip())
                    kept = parts[:max_sentences]
                    out = ' '.join(p.strip() for p in kept)
                    return out

                semantic_answer = truncate_answer(semantic_answer, max_sentences=5)

                # Compose a backward-compatible human-readable response string (kept for existing frontends)
                response_text = f"{semantic_answer}\n\n---\n\n**📚 Learn More:**\n\n"
            # Keep only top-3 evidence items by score
            evidence = sorted(evidence, key=lambda x: x.get('score', 0), reverse=True)[:3]

            # Group remaining evidence by video title for display
            videos = {}
            for item in evidence:
                title = item['title']
                if title not in videos:
                    videos[title] = []
                videos[title].append(item['timestamp'])

            for video_title, ts_list in videos.items():
                # find a video number from evidence
                video_num = None
                for it in evidence:
                    if it['title'] == video_title and it.get('number') is not None:
                        video_num = it['number']
                        break
                timestamp_list = ', '.join(ts_list[:3])
                response_text += f"📺 Video {video_num if video_num is not None else ''}: {video_title} 🕒 {timestamp_list}\n\n"

            response_text += "\n💡 **These videos are from the Sigma Web Development Course on YouTube.**"

            # Save response for debugging
            try:
                with open("response.txt", "w", encoding="utf-8") as f:
                    f.write(response_text)
            except Exception:
                pass

            return jsonify({
                'question': incoming_query,
                'semantic_answer': semantic_answer,
                'llm_answer': ai_answer,
                'fallback_summary': fallback_summary,
                'evidence': evidence,
                'response': response_text,
                'sources': new_df[["title", "number", "start", "end"]].to_dict('records')
            })
        
        # Add video timestamps
        videos = {}
        for idx, row in new_df.iterrows():
            title = row['title']
            number = row['number']
            start = row['start']
            
            if title not in videos:
                videos[title] = []
            videos[title].append({
                'number': number,
                'timestamp': f"{int(start // 60)}:{int(start % 60):02d}"
            })
        
        for video_title, timestamps in videos.items():
            video_num = timestamps[0]['number']
            timestamp_list = ', '.join([ts['timestamp'] for ts in timestamps[:3]])
            response += f"📺 Video {video_num}: {video_title} 🕒 {timestamp_list}\n\n"
        
        # Add course information footer
        response += "\n💡 **These videos are from the Sigma Web Development Course on YouTube.**"
        
        # Save response for debugging
        with open("response.txt", "w", encoding="utf-8") as f:
            f.write(response)
        
        return jsonify({
            "response": response,
            "question": incoming_query,
            "sources": new_df[["title", "number", "start", "end"]].to_dict('records')
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for cloud deployment"""
    try:
        # Check if embeddings are loaded
        embeddings_loaded = df is not None
        
        # Check if Groq API key is configured
        groq_api_configured = bool(os.getenv('GROQ_API_KEY'))
        
        return jsonify({
            "status": "healthy",
            "embeddings_loaded": embeddings_loaded,
            "groq_api_configured": groq_api_configured,
            "api_type": "Groq Llama 3.1 (Fast & Free)"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/mapper-status', methods=['GET'])
def mapper_status():
    """Return mapper/load status and dims for quick diagnostics."""
    try:
        # The project no longer requires a trained mapper by default. If you kept
        # This endpoint was previously used to inspect a trained mapper artifact.
        # The project now uses a single consistent embedding model and no mapper.
        return jsonify({
            'stored_embedding_dim': stored_embedding_dim,
            'lightweight_model_loaded': embed_model is not None,
            'mapper_present': False,
            'note': 'mapper support removed; re-embed dataset with the lightweight model instead'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/warmup', methods=['GET'])
def warmup():
    """Trigger background loading of the lightweight embedding model.

    Returns immediately with JSON indicating whether the model is already
    loaded or the warmup has been scheduled/attempted.
    """
    try:
        if embed_model is not None:
            return jsonify({'status': 'already_loaded'}), 200

        # Spawn a background thread to warm the model and return immediately.
        import threading

        def _warm():
            try:
                print("ℹ️ Background warm thread started")
                load_embed_model()
                print("ℹ️ Background warm thread finished")
            except Exception as ex:
                print(f"⚠️ Background warm thread error: {ex}")

        t = threading.Thread(target=_warm, daemon=True)
        t.start()
        return jsonify({'status': 'warming'}), 202
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    """Simple welcome message"""
    return jsonify({
        "message": "Sigma Web Development Course - AI Assistant API",
        "endpoints": {
            "/ask": "POST - Ask a question",
            "/health": "GET - Check system health"
        }
    })

if __name__ == '__main__':
    # Get port from environment variable for Cloud Run
    port = int(os.environ.get('PORT', 8080))
    
    print("\n" + "="*50)
    print("🚀 Sigma Web Development Course - AI Assistant")
    print("="*50)
    print("✓ Flask server starting...")
    print(f"✓ API available at: http://localhost:{port}")
    print(f"✓ Health check: http://localhost:{port}/health")
    print("="*50 + "\n")

    # Optional pre-warm embedding model on startup if env var is set.
    prewarm = os.environ.get('PREWARM_EMBEDDING', '').lower() in ['1', 'true', 'yes']
    if prewarm:
        try:
            import threading
            def _bg_warm():
                print("ℹ️ PREWARM_EMBEDDING set — loading embedding model in background")
                load_embed_model()

            t = threading.Thread(target=_bg_warm, daemon=True)
            t.start()
        except Exception as e:
            print(f"⚠️ Failed to start background pre-warm thread: {e}")

    app.run(debug=False, host='0.0.0.0', port=port)
