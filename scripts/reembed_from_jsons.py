#!/usr/bin/env python3
"""
Re-embed all chunks by reading JSON files from the `jsons/` folder.
Saves `embeddings.joblib` containing a pandas DataFrame with columns:
  ['title','number','start','end','text','embedding']
Creates a backup of an existing `embeddings.joblib` as `embeddings.joblib.bak`.

Usage:
  python scripts/reembed_from_jsons.py --model sentence-transformers/all-MiniLM-L6-v2
"""
import os
import json
import joblib
import argparse
from glob import glob
from tqdm import tqdm
import pandas as pd
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    raise RuntimeError('sentence-transformers must be installed. Run: pip install sentence-transformers')

DEFAULT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'
JSON_DIR = 'jsons'
OUT_PATH = 'embeddings.joblib'


def collect_chunks(json_dir=JSON_DIR):
    files = sorted(glob(os.path.join(json_dir, '*.json')))
    rows = []
    for p in files:
        with open(p, 'r', encoding='utf-8') as f:
            data = json.load(f)
        chunks = data.get('chunks', [])
        for c in chunks:
            # Expecting fields: number, title, start, end, text
            rows.append({
                'title': c.get('title'),
                'number': c.get('number'),
                'start': float(c.get('start', 0) or 0),
                'end': float(c.get('end', 0) or 0),
                'text': (c.get('text') or '').strip()
            })
    df = pd.DataFrame(rows)
    return df


def embed_dataframe(df, model_name=DEFAULT_MODEL, batch_size=256):
    model = SentenceTransformer(model_name)
    texts = df['text'].fillna('').astype(str).tolist()
    all_embs = []
    for i in tqdm(range(0, len(texts), batch_size), desc='Embedding batches'):
        batch = texts[i:i+batch_size]
        emb = model.encode(batch, convert_to_numpy=True, show_progress_bar=False)
        all_embs.append(emb)
    if all_embs:
        embs = np.vstack(all_embs)
    else:
        embs = np.zeros((len(texts), model.get_sentence_embedding_dimension()))
    df = df.copy()
    df['embedding'] = list(embs)
    return df


def save_with_backup(df, out_path=OUT_PATH):
    if os.path.exists(out_path):
        bak = out_path + '.bak'
        print(f'Backing up existing {out_path} -> {bak}')
        if not os.path.exists(bak):
            joblib.dump(joblib.load(out_path), bak)
        else:
            print('Backup already exists; leaving it unchanged')
    print(f'Saving new embeddings to {out_path}')
    joblib.dump(df, out_path)


def main(model_name=DEFAULT_MODEL, json_dir=JSON_DIR, out_path=OUT_PATH, batch_size=256):
    print(f'Collecting JSON chunks from {json_dir}')
    df = collect_chunks(json_dir)
    print(f'Collected {len(df)} chunks')
    if len(df) == 0:
        print('No chunks found; exiting')
        return
    print(f'Embedding using model: {model_name}')
    df_emb = embed_dataframe(df, model_name=model_name, batch_size=batch_size)
    save_with_backup(df_emb, out_path=out_path)
    print('Re-embedding complete')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', default=DEFAULT_MODEL)
    parser.add_argument('--json_dir', default=JSON_DIR)
    parser.add_argument('--out', default=OUT_PATH)
    parser.add_argument('--batch', type=int, default=256)
    args = parser.parse_args()
    main(model_name=args.model, json_dir=args.json_dir, out_path=args.out, batch_size=args.batch)
