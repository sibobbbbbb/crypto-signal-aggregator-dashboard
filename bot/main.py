import os
from dotenv import load_dotenv
from telethon import TelegramClient, events
from supabase import create_client, Client
from parser import extract_signal_data

# Load environment variables
load_dotenv()

TG_ID = os.getenv('TG_API_ID')
TG_HASH = os.getenv('TG_API_HASH')
SUPA_URL = os.getenv('SUPABASE_URL')
SUPA_KEY = os.getenv('SUPABASE_SERVICE_KEY')

# Parse target channels from .env string into a list
raw_channels = os.getenv('TARGET_CHANNELS', '').split(',')
CHANNELS = [int(ch.strip()) if ch.strip().lstrip('-').isdigit() else ch.strip() for ch in raw_channels if ch.strip()]

# Initialize Supabase client
print("🔄 Connecting to Supabase...")
supabase: Client = create_client(SUPA_URL, SUPA_KEY)

# Initialize Telegram client
print("🔄 Connecting to Telegram...")
client = TelegramClient('farhan_session', TG_ID, TG_HASH)

# Event listener for new messages in target channels
@client.on(events.NewMessage(chats=CHANNELS))
async def message_handler(event):
    message_text = event.message.message
    sender = await event.get_sender()
    chat_name = sender.title if hasattr(sender, 'title') else 'Unknown Chat'
    
    print(f"\n📩 New message from {chat_name}:")
    print(f"   {message_text[:50].replace(chr(10), ' ')}...")

    # Call the parser to extract signal data
    signal_data = extract_signal_data(message_text)

    if signal_data:
        print(f"   ✅ Signal Detected: {signal_data['coin']} ({signal_data['direction']})")
        
        # Prepare payload for database insertion
        payload = {
            "coin_symbol": signal_data['coin'],
            "direction": signal_data['direction'],
            "entry_price": signal_data['entry'],
            "sl_price": signal_data['sl'],
            "tp_targets": signal_data['tps'],
            "raw_message": message_text
        }

        # Insert into Supabase
        try:
            supabase.table('signals').insert(payload).execute()
            print("   💾 Successfully saved to Database!")
        except Exception as e:
            print(f"   ❌ Failed to save to DB: {e}")
    else:
        print("   ⚠️ Not a valid signal or unrecognized format.")

# Start Bot
if __name__ == '__main__':
    print(f"🚀 Bot Running! Monitoring {len(CHANNELS)} channel(s)...")
    print("   Press Ctrl+C to stop.")
    client.start()
    client.run_until_disconnected()