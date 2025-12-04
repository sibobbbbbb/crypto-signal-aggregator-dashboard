import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load API Key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Konfigurasi Model
generation_config = {
    "temperature": 0.1,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-pro",
    generation_config=generation_config,
    system_instruction="""
    You are a crypto trading signal parser. 
    Your job is to extract trading signal details from user messages.
    
    Output Format (JSON):
    {
        "is_signal": boolean,     // True only if it contains specific entry, SL, or TP
        "coin_symbol": string,    // e.g. "BTC", "ETH" (Remove $ or /USDT)
        "direction": string,      // "LONG" or "SHORT"
        "entry_price": number,    // The main entry price
        "sl_price": number,       // Stop Loss price
        "tp_targets": [number]    // Array of Take Profit prices
    }

    Rules:
    1. If the message is NOT a trading signal (just conversation), set "is_signal": false.
    2. Convert all prices to numbers/floats.
    3. Ignore leverage or margin amounts, focus on price levels.
    4. If multiple TPs are listed, put them in the array.
    """
)

def extract_signal_data(raw_text):
    try:
        response = model.generate_content(raw_text)
        parsed_data = json.loads(response.text)
        
        if parsed_data.get('is_signal') == True and parsed_data.get('entry_price'):
            return {
                'coin': parsed_data.get('coin_symbol'),
                'direction': parsed_data.get('direction'),
                'entry': parsed_data.get('entry_price'),
                'sl': parsed_data.get('sl_price'),
                'tps': parsed_data.get('tp_targets', [])
            }
            
    except Exception as e:
        print(f"   ⚠️ AI Parsing Error: {e}")
    
    return None