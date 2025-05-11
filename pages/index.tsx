import { useEffect, useState } from 'react';
import portfolio from '../data/portfolio.json';

type PortfolioItem = {
  Sembol: string;
  Adet: number;
  'Toplam Adet': number;
  'Toplam Fiyat ($)': number;
};

type Prices = Record<string, number>;

const sabitFiyatlar: Prices = {
  DEFAIUSDT: 0.00756
};

export default function Home() {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then((binancePrices) => {
        setPrices({ ...binancePrices, ...sabitFiyatlar });
      })
      .finally(() => setLoading(false));
  }, []);

  const validRows = portfolio.filter(
    (item) =>
      typeof item.Sembol === 'string' &&
      item.Sembol &&
      item['Toplam Adet'] > 0
  );

  const totalValue = validRows.reduce((acc, item) => {
    const symbol = item.Sembol;
    const price = prices[symbol] ?? 0;
    const value =
      symbol === 'USDT'
        ? item['Toplam Adet']
        : item['Toplam Adet'] * price;

    return acc + value;
  }, 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Portföy Tablosu</h1>
      {loading ? (
        <p>Fiyatlar yükleniyor...</p>
      ) : (
        <>
          <table border={1} cellPadding={8} cellSpacing={0}>
            <thead>
              <tr>
                <th>Sembol</th>
                <th>Adet</th>
                <th>Canlı Fiyat (USDT)</th>
                <th>Hesaplanan Değer ($)</th>
              </tr>
            </thead>
            <tbody>
              {validRows.map((item) => {
                const price = prices[item.Sembol] ?? 0;
                const value =
                  item.Sembol === 'USDT'
                    ? item['Toplam Adet']
                    : item['Toplam Adet'] * price;

                return (
                  <tr key={item.Sembol}>
                    <td>{item.Sembol}</td>
                    <td>{item['Toplam Adet']}</td>
                    <td>{price.toFixed(6)}</td>
                    <td>{value.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 style={{ marginTop: '2rem' }}>
            Toplam Varlık: {totalValue.toFixed(2)} $
          </h2>
        </>
      )}
    </div>
  );
}