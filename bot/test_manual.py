import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
from parser import extract_signal_data

# Load Config
load_dotenv()

SUPA_URL = os.getenv('SUPABASE_URL')
SUPA_KEY = os.getenv('SUPABASE_SERVICE_KEY')

# Init Supabase
print("🔄 Connecting to Supabase...")
supabase: Client = create_client(SUPA_URL, SUPA_KEY)

# --- EXAMPLE SIGNAL MESSAGE ---
TEST_MESSAGE = """
$BTC / LONG
Entry price: 96500
Invalidation price: 95000
Take Profit: 98000, 99000, 100000
"""

def run_test():
    print("-" * 50)
    print("🧪 STARTING MANUAL TEST...")
    print(f"📩 Input Message:\n{TEST_MESSAGE}")
    print("-" * 50)

    # 1. Test AI Parser
    print("🤖 Sending to AI (Gemini)...")
    try:
        signal_data = extract_signal_data(TEST_MESSAGE)
    except Exception as e:
        print(f"❌ AI Error: {e}")
        return

    if not signal_data:
        print("⚠️ AI Reject: Message considered not a valid signal.")
        return

    print(f"✅ AI Successfully Extracted Data:")
    print(f"   Coin: {signal_data['coin']}")
    print(f"   Direction: {signal_data['direction']}")
    print(f"   Entry: {signal_data['entry']}")
    print(f"   SL: {signal_data['sl']}")
    print(f"   TP: {signal_data['tps']}")

    # 2. Test Database Insert
    print("\n💾 Attempting to save to Supabase...")
    payload = {
        "coin_symbol": signal_data['coin'],
        "direction": signal_data['direction'],
        "entry_price": signal_data['entry'],
        "sl_price": signal_data['sl'],
        "tp_targets": signal_data['tps'],
        "raw_message": TEST_MESSAGE
    }

    try:
        data = supabase.table('signals').insert(payload).execute()
        print("✅ SUCCESS! Data saved to Database.")
        print("🚀 Check your Dashboard now, a new card should appear!")
    except Exception as e:
        print(f"❌ Database Error: {e}")

if __name__ == "__main__":
    run_test()