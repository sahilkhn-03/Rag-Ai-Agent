import requests
import os
import json
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib

def create_embedding(text_list):
    # This repository now uses sentence-transformers/all-MiniLM-L6-v2 for embeddings.
    # For one-off local preprocessing you can either:
    # - Use the provided scripts/reembed_from_jsons.py which runs SentenceTransformer,
    # - Or implement a local call here (example shown) to produce embeddings.
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    emb = model.encode(text_list, convert_to_numpy=True)
    return emb.tolist()


jsons = os.listdir("jsons")  # List all the jsons 
my_dicts = []
chunk_id = 0

for json_file in jsons:
    with open(f"jsons/{json_file}") as f:
        content = json.load(f)
    print(f"Creating Embeddings for {json_file}")
    embeddings = create_embedding([c['text'] for c in content['chunks']])
       
    for i, chunk in enumerate(content['chunks']):
        chunk['chunk_id'] = chunk_id
        chunk['embedding'] = embeddings[i]
        chunk_id += 1
        my_dicts.append(chunk) 

df = pd.DataFrame.from_records(my_dicts)
# Save this dataframe
joblib.dump(df, 'embeddings.joblib')

