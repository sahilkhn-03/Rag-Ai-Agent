"""
Test RAG system locally to debug issues
"""
import os
import requests
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

print("="*60)
print("RAG SYSTEM TEST")
print("="*60)

# 1. Check Environment Variables
print("\n1. CHECKING ENVIRONMENT VARIABLES...")
groq_key = os.getenv('GROQ_API_KEY', '')
if groq_key:
    print(f"✓ GROQ_API_KEY found from .env: {groq_key[:15]}...{groq_key[-10:]}")
else:
    print("✗ GROQ_API_KEY NOT found!")
    print("Please add your key to the .env file")
    print("See GROQ_API_SETUP.md for instructions")
    exit(1)

# 2. Check Embeddings File
print("\n2. CHECKING EMBEDDINGS FILE...")
try:
    df = joblib.load('embeddings.joblib')
    print(f"✓ Embeddings loaded: {len(df)} chunks")
    print(f"  Sample columns: {list(df.columns)}")
except Exception as e:
    print(f"✗ Error loading embeddings: {e}")
    exit(1)

# 3. Test Ollama Embedding Creation
print("\n3. TESTING EMBEDDING CREATION (local SentenceTransformer)")
test_query = "what is CSS"
try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    question_embedding = model.encode([test_query], convert_to_numpy=True)[0]
    print(f"✓ Created embedding for '{test_query}'")
    print(f"  Embedding dimension: {len(question_embedding)}")
except Exception as e:
    print(f"✗ Embedding creation error: {e}")
    print("  Make sure sentence-transformers is installed or use scripts/reembed_from_jsons.py")
    exit(1)

# 4. Test Semantic Search
print("\n4. TESTING SEMANTIC SEARCH...")
similarities = cosine_similarity(np.vstack(df['embedding']), [question_embedding]).flatten()
top_results = 5
max_indx = similarities.argsort()[::-1][0:top_results]
new_df = df.loc[max_indx]

print(f"✓ Found {len(new_df)} relevant chunks:")
for idx, row in new_df.iterrows():
    print(f"  - [{row['number']}] {row['title'][:50]}... (similarity: {similarities[idx]:.3f})")
    print(f"    Text: {row['text'][:100]}...")

# 5. Create Prompt
print("\n5. CREATING LLM PROMPT...")
context_parts = []
for idx, row in new_df.iterrows():
    text = row['text'].strip()
    if text and len(text) > 20:
        context_parts.append(text)

context = '\n\n'.join(context_parts[:5])
prompt = f"""You are a helpful web development teaching assistant. Based on the course content below, provide a clear, complete answer to the student's question.

Course Content:
{context}

Student Question: {test_query}

Provide a comprehensive answer (3-5 sentences) that explains the concept clearly using the information from the course content above. Be specific and educational:"""

print(f"✓ Prompt created: {len(prompt)} characters")
print(f"\nPrompt preview:\n{prompt[:300]}...\n")

# 6. Test Groq API Call
print("\n6. TESTING GROQ API CALL...")
headers = {
    "Authorization": f"Bearer {groq_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama-3.1-8b-instant",  # Updated model (llama3-8b-8192 deprecated)
    "messages": [
        {
            "role": "user",
            "content": prompt
        }
    ],
    "temperature": 0.7,
    "max_tokens": 500
}

try:
    print(f"→ Calling Groq API...")
    r = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=30
    )
    
    print(f"← Response status: {r.status_code}")
    
    if r.status_code == 200:
        response = r.json()
        answer = response['choices'][0]['message']['content']
        print(f"\n✓ SUCCESS! AI Answer received:")
        print("="*60)
        print(answer)
        print("="*60)
        print(f"\nAnswer length: {len(answer)} characters")
    else:
        print(f"\n✗ FAILED! Groq API Error:")
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
        
except Exception as e:
    print(f"\n✗ EXCEPTION during API call:")
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60)
