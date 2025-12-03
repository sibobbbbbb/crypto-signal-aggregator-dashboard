import re

def extract_signal_data(raw_text):
    """
    Parses raw text from Telegram to extract signal data.
    Returns a dictionary of clean data or None if it's not a valid signal.
    """

    text_clean = raw_text.replace('*', '').replace('`', '').strip()

    # Initialize data structure
    data = {
        'coin': None,
        'direction': None,
        'entry': 0.0,
        'sl': 0.0,
        'tps': []
    }

    # A. Find Coin Symbol (e.g., $BTC, BTC/USDT, #ETH)
    coin_match = re.search(r'(?:\$|\#)?([A-Z]{2,6})(?:/USDT|\s|$)', text_clean, re.IGNORECASE)
    if coin_match:
        data['coin'] = coin_match.group(1).upper()
    else:
        return None

    # B. Find Direction (LONG/SHORT/BUY/SELL)
    if re.search(r'(?i)\b(long|buy)\b', text_clean):
        data['direction'] = 'LONG'
    elif re.search(r'(?i)\b(short|sell)\b', text_clean):
        data['direction'] = 'SHORT'
    else:
        return None

    # C. Find Entry Price
    entry_match = re.search(r'(?i)(?:entry|price|now)[\s:]*?([\d.]+)', text_clean)
    if entry_match:
        try:
            data['entry'] = float(entry_match.group(1))
        except ValueError:
            pass

    # D. Find Stop Loss (SL)
    sl_match = re.search(r'(?i)(?:sl|stop|invalid|cut)[\s:]*?([\d.]+)', text_clean)
    if sl_match:
        try:
            data['sl'] = float(sl_match.group(1))
        except ValueError:
            pass

    # E. Find Take Profits (TP) - Can be multiple
    raw_tps = re.findall(r'(?i)(?:tp|target)[\s\d]*[:=]\s*([\d.]+)', text_clean)

    if not raw_tps:
        lines = text_clean.split('\n')
        for line in lines:
            if 'tp' in line.lower() or 'target' in line.lower():
                nums = re.findall(r'([\d.]+)', line)
                for n in nums:
                    try:
                        val = float(n)
                        if val not in [1.0, 2.0, 3.0]:
                            data['tps'].append(val)
                    except ValueError:
                        pass
    else:
         data['tps'] = [float(x) for x in raw_tps]

    # Final validation: Coin and a positive Entry Price are mandatory.
    if data['coin'] and data['entry'] > 0:
        return data

    return None