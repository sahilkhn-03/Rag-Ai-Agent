#!/usr/bin/env python3
"""
Re-embed all chunks using a single lightweight model and overwrite embeddings.joblib
Creates a backup of the existing embeddings.joblib as embeddings.joblib.bak
"""
import os
import joblib
import argparse
from sentence_transformers import SentenceTransformer
import numpy as np

DEFAULT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'


def load_dataset(path='embeddings.joblib'):
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path} not found")
    data = joblib.load(path)
    return data


def save_embeddings(df, path='embeddings.joblib'):
    joblib.dump(df, path)


def main(model_name=DEFAULT_MODEL, src='embeddings.joblib', out='embeddings.joblib'):
    print(f"Loading dataset from {src}")
    df = load_dataset(src)

    # Backup
    bak = src + '.bak'
    if not os.path.exists(bak):
        print(f"Creating backup: {bak}")
        joblib.dump(df, bak)
    else:
        print(f"Backup already exists: {bak}")

    print(f"Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)

    texts = []
    idxs = []
    for i, row in df.iterrows():
        t = row.get('text', '')
        texts.append(t)
        idxs.append(i)

    batch_size = 256
    embeddings = []
    print(f"Embedding {len(texts)} chunks in batches of {batch_size}")
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        emb = model.encode(batch, convert_to_numpy=True, show_progress_bar=False)
        embeddings.append(emb)
    embeddings = np.vstack(embeddings)

    # Replace embeddings column
    df = df.copy()
    df['embedding'] = list(embeddings)

    # Save
    print(f"Saving new embeddings to {out}")
    save_embeddings(df, out)
    print("Done")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', default=DEFAULT_MODEL)
    parser.add_argument('--src', default='embeddings.joblib')
    parser.add_argument('--out', default='embeddings.joblib')
    args = parser.parse_args()
    main(model_name=args.model, src=args.src, out=args.out)
