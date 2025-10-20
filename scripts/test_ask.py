import requests
import json

URL = 'http://localhost:8080/ask'

def run(question='What is HTML?'):
    payload = {'question': question}
    r = requests.post(URL, json=payload)
    print('status', r.status_code)
    try:
        data = r.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:4000])
    except Exception as e:
        print('error parsing json', e)
        print(r.text)

if __name__ == '__main__':
    run()
