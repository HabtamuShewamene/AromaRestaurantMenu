import urllib.request
import json
import re

url = 'https://www.tiktok.com/@aromarestaurantdb'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        match = re.search(r'id="__UNIVERSAL_DATA_FOR_REHYDRATION__">([^<]+)', html)
        if match:
            data = json.loads(match.group(1))
            with open('tiktok_dump.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print('Extracted universal data successfully!')
        else:
            match_sigi = re.search(r'window\[\'SIGI_STATE\'\]=({.*?});window', html)
            if match_sigi:
                data = json.loads(match_sigi.group(1))
                with open('tiktok_dump.json', 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print('Extracted SIGI_STATE successfully!')
            else:
                print('Could not find data in HTML. Writing HTML for debug...')
                with open('tiktok_dump.html', 'w', encoding='utf-8') as f:
                    f.write(html)
except Exception as e:
    print('Error:', e)
