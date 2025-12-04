from telethon import TelegramClient
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

api_id = os.getenv('TG_API_ID')
api_hash = os.getenv('TG_API_HASH')

client = TelegramClient('farhan_session', api_id, api_hash)

async def main():
    print("Sedang mengambil daftar dialog...")
    async for dialog in client.iter_dialogs():
        print(f"Nama: {dialog.name} | ID: {dialog.id}")

with client:
    client.loop.run_until_complete(main())