import os
import asyncio
from dotenv import load_dotenv
from telethon import TelegramClient, events
from supabase import create_client, Client

# Import parser AI
from parser import extract_signal_data

# Load Configuration
load_dotenv()

TG_ID = os.getenv('TG_API_ID')
TG_HASH = os.getenv('TG_API_HASH')
SUPA_URL = os.getenv('SUPABASE_URL')
SUPA_KEY = os.getenv('SUPABASE_SERVICE_KEY')

# --- TARGET CHANNEL ---
raw_channels = os.getenv('TARGET_CHANNELS', '').split(',')
CHANNELS = []
for ch in raw_channels:
    ch = ch.strip()
    if ch.lstrip('-').isdigit(): 
        CHANNELS.append(int(ch))
    else:
        CHANNELS.append(ch)

# --- TOPIC FILTER ---
raw_topic_ids = os.getenv('ALLOWED_TOPIC_IDS', '')
ALLOWED_TOPIC_IDS = []
if raw_topic_ids:
    ALLOWED_TOPIC_IDS = [int(tid.strip()) for tid in raw_topic_ids.split(',') if tid.strip().isdigit()]

print(f"⚙️ Config Loaded:")
print(f"   - Channels: {CHANNELS}")
print(f"   - Whitelist Topics: {ALLOWED_TOPIC_IDS if ALLOWED_TOPIC_IDS else 'ALL TOPICS (No Filter)'}")

# --- FILTER KEYWORDS ---
MUST_HAVE_KEYWORDS = [
    "entry", "buy", "sell", "long", "short", 
    "tp", "target", "sl", "stop", "invalidation",
    "profit", "setup", "limit", "market"
]

# Init Clients
print("🔄 Connecting to Supabase...")
supabase: Client = create_client(SUPA_URL, SUPA_KEY)

print("🔄 Connecting to Telegram...")
client = TelegramClient('farhan_session', TG_ID, TG_HASH)

@client.on(events.NewMessage(chats=CHANNELS))
async def my_event_handler(event):

    raw_text = event.message.message
    
    if not raw_text:
        return

    topic_id = None
    if event.message.reply_to:
        topic_id = getattr(event.message.reply_to, 'reply_to_top_id', None)
        if not topic_id:
            topic_id = event.message.reply_to.reply_to_msg_id

    if ALLOWED_TOPIC_IDS and topic_id not in ALLOWED_TOPIC_IDS:
        return

    text_lower = raw_text.lower()

    # --- STAGE 1: PRE-SCREENING (Prevent Spam from entering AI) ---
    has_keyword = any(word in text_lower for word in MUST_HAVE_KEYWORDS)
    
    if not has_keyword:
        return 

    # --- STAGE 2: AI PROCESSING ---
    sender = await event.get_sender()
    chat_name = sender.title if hasattr(sender, 'title') else 'Unknown Chat'
    print(f"\n📩 Potential Signal from {chat_name}:")
    print(f"   Context: {raw_text[:50].replace(chr(10), ' ')}...")

    signal_data = extract_signal_data(raw_text)

    if signal_data:
        print(f"   ✅ AI Confirm: {signal_data['coin']} ({signal_data['direction']})")
        
        payload = {
            "coin_symbol": signal_data['coin'],
            "direction": signal_data['direction'],
            "entry_price": signal_data['entry'],
            "sl_price": signal_data['sl'],
            "tp_targets": signal_data['tps'],
            "raw_message": raw_text,
            "topic_id": topic_id
        }

        try:
            supabase.table('signals').insert(payload).execute()
            print("   💾 Saved to DB!")
        except Exception as e:
            print(f"   ❌ DB Error: {e}")
    else:
        print("   ⚠️ AI Reject: Not a complete signal format.")

if __name__ == '__main__':
    print(f"🚀 Bot Running with Smart Filter!")
    print("   Waiting for signals (Regular chats will be ignored)...")
    client.start()
    client.run_until_disconnected()