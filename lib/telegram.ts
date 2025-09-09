import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export function verifyInitData(initData: string): boolean {
  try {
    if (!initData) return false;
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash') || '';
    urlParams.delete('hash');
    const data = [...urlParams.entries()]
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('\n');

    const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const computed = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return computed === hash;
  } catch {
    return false;
  }
}

export function getUserFromInitData(initData: string):
  | { id: number; username?: string; first_name?: string; last_name?: string }
  | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
