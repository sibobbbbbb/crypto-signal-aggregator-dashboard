import os
import asyncio
from dotenv import load_dotenv
from telethon import TelegramClient

# Load configuration
load_dotenv()

TG_ID = os.getenv('TG_API_ID')
TG_HASH = os.getenv('TG_API_HASH')

target_str = os.getenv('TARGET_CHANNELS', '').split(',')[0].strip()
if not target_str.lstrip('-').isdigit():
    print("❌ ERROR: TARGET_CHANNELS in .env is still a Username/Name.")
    print("👉 Please change it to a numeric ID (e.g., -100123456789) using the cek_id.py script first.")
    exit()

TARGET_CHANNEL_ID = int(target_str)

client = TelegramClient('farhan_session', TG_ID, TG_HASH)

async def main():
    print(f"🔍 Reading chat history in ID: {TARGET_CHANNEL_ID}...")
    print("⏳ Please wait...")

    found_topics = {}

    # Read the last 300 messages
    async for message in client.iter_messages(TARGET_CHANNEL_ID, limit=300):
        if message.reply_to:
            topic_id = getattr(message.reply_to, 'reply_to_top_id', None)
            
            if not topic_id:
                topic_id = message.reply_to.reply_to_msg_id

            if topic_id:
                if topic_id not in found_topics:
                    text = message.message.replace('\n', ' ')[:40] if message.message else "[Image/Sticker]"
                    text = message.message.replace('\n', ' ')[:40] if message.message else "[Image/Sticker]"
                    found_topics[topic_id] = text

    print(f"\n✅ SCAN RESULT: Found {len(found_topics)} Active Topics")
    print("=" * 60)
    print(f"{'TOPIC ID':<10} | {'LATEST MESSAGE PREVIEW'}")
    print("-" * 60)
    
    for t_id, preview in found_topics.items():
        print(f"{t_id:<10} | {preview}")
    print("=" * 60)
    print("👉 Copy 'TOPIC ID' that contains signals to ALLOWED_TOPIC_IDS in main.py")

with client:
    client.loop.run_until_complete(main())