export const config = {
  runtime: 'nodejs'
};

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price');

    if (!response.ok) {
      throw new Error(`Binance API response not OK: ${response.status}`);
    }

    const data = await response.json();
    const prices: Record<string, number> = {};

    data.forEach((item: { symbol: string; price: string }) => {
      prices[item.symbol] = parseFloat(item.price);
    });

    res.status(200).json(prices);
  } catch (error: any) {
    console.error('Binance API error:', error.message);
    res.status(500).json({ error: 'Binance API hatası' });
  }
}
