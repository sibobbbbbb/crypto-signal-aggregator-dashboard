import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

# Load API Key
load_dotenv()

# Inisialisasi Client Groq
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

def extract_signal_data(raw_text):
    system_prompt = """
    You are a crypto signal parser. Extract data into this JSON format:
    {
        "is_signal": boolean,
        "coin_symbol": string, 
        "direction": "LONG" or "SHORT",
        "entry_price": number,
        "sl_price": number,
        "tp_targets": [number]
    }
    Rules:
    - If not a signal, set "is_signal": false.
    - Remove $ or /USDT from symbol.
    - Return ONLY the JSON string. No markdown, no explanation.
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_text}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        result_text = chat_completion.choices[0].message.content
        parsed_data = json.loads(result_text)
        
        if parsed_data.get('is_signal') == True and parsed_data.get('entry_price'):
            return {
                'coin': parsed_data.get('coin_symbol'),
                'direction': parsed_data.get('direction'),
                'entry': parsed_data.get('entry_price'),
                'sl': parsed_data.get('sl_price'),
                'tps': parsed_data.get('tp_targets', [])
            }
            
        return None

    except Exception as e:
        print(f"   ⚠️ Groq Error: {e}")
        return None