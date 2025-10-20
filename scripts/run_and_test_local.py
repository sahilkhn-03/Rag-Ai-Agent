import time
import requests
import sys

HEALTH='http://localhost:8080/health'
ASK='http://localhost:8080/ask'
QUESTION='What is tags in html'

print('Waiting for server to be ready at', HEALTH)
for i in range(120):
    try:
        r = requests.get(HEALTH, timeout=2)
        if r.status_code == 200:
            print('Server ready')
            break
    except Exception as e:
        pass
    time.sleep(1)
else:
    print('Timeout waiting for server (120s)')
    sys.exit(2)

try:
    r = requests.post(ASK, json={'question': QUESTION}, timeout=60)
    print('STATUS', r.status_code)
    print(r.text)
except Exception as e:
    print('Request failed:', e)
    sys.exit(1)
