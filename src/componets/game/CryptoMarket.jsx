import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const CRYPTOS = [
  { id: 'DGM', name: 'Doge-Miau', color: '#ff6b00', volatility: 0.15, basePrice: 10 },
  { id: 'ETN', name: 'Eternium', color: '#00d4ff', volatility: 0.08, basePrice: 50 },
  { id: 'PDC', name: 'Pump-and-Dump Coin', color: '#b026ff', volatility: 0.25, basePrice: 5 },
];

export default function CryptoMarket({ bitCoins, setBitCoins, portfolio, setPortfolio, currentNews, techTree }) {
  const [prices, setPrices] = useState({
    DGM: 10,
    ETN: 50,
    PDC: 5,
  });

  const [priceHistory, setPriceHistory] = useState({
    DGM: [10],
    ETN: [50],
    PDC: [5],
  });

  const [selectedCrypto, setSelectedCrypto] = useState('DGM');

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const newPrices = { ...prev };
        
        CRYPTOS.forEach(crypto => {
          let change = (Math.random() - 0.5) * 2 * crypto.volatility;
          
          // Apply news effects
          if (currentNews) {
            if (currentNews.crypto === crypto.id || currentNews.crypto === 'ALL') {
              change += currentNews.change;
            }
          }
          
          newPrices[crypto.id] = Math.max(0.1, prev[crypto.id] * (1 + change));
        });
        
        return newPrices;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentNews]);

  // Update price history
  useEffect(() => {
    setPriceHistory(prev => {
      const newHistory = { ...prev };
      Object.keys(prices).forEach(key => {
        newHistory[key] = [...prev[key].slice(-20), prices[key]];
      });
      return newHistory;
    });
  }, [prices]);

  const formatNumber = (num) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const buy = (cryptoId, amount) => {
    const cost = prices[cryptoId] * amount;
    if (bitCoins >= cost) {
      setBitCoins(prev => prev - cost);
      setPortfolio(prev => ({
        ...prev,
        [cryptoId]: (prev[cryptoId] || 0) + amount
      }));
    }
  };

  const buyMax = (cryptoId) => {
    const maxCanBuy = Math.floor(bitCoins / prices[cryptoId]);
    if (maxCanBuy > 0) {
      buy(cryptoId, maxCanBuy);
    }
  };

  const sell = (cryptoId, amount) => {
    if (portfolio[cryptoId] >= amount) {
      const profit = prices[cryptoId] * amount * (techTree.marketBonus || 1);
      setBitCoins(prev => prev + profit);
      setPortfolio(prev => ({
        ...prev,
        [cryptoId]: prev[cryptoId] - amount
      }));
    }
  };

  const sellMax = (cryptoId) => {
    const maxCanSell = portfolio[cryptoId] || 0;
    if (maxCanSell > 0) {
      sell(cryptoId, maxCanSell);
    }
  };

  const selectedData = CRYPTOS.find(c => c.id === selectedCrypto);
  const currentPrice = prices[selectedCrypto];
  const history = priceHistory[selectedCrypto];
  const isUp = history.length > 1 && history[history.length - 1] > history[history.length - 2];
  const maxCanBuy = Math.floor(bitCoins / currentPrice);
  const maxCanSell = portfolio[selectedCrypto] || 0;

  return (
    <div className="retro-border bg-gradient-to-br from-gray-900 to-pink-900 p-4 rounded-lg">
      <div className="text-pink-400 text-sm pixel-font mb-3 text-center">
        MERCADO DE CRYPTOS
      </div>

      {/* Crypto selector */}
      <div className="flex gap-2 mb-3">
        {CRYPTOS.map(crypto => (
          <button
            key={crypto.id}
            onClick={() => setSelectedCrypto(crypto.id)}
            className={`flex-1 p-2 rounded text-xs pixel-font retro-button transition-all ${
              selectedCrypto === crypto.id
                ? 'bg-opacity-80 scale-95'
                : 'bg-opacity-40'
            }`}
            style={{ 
              backgroundColor: crypto.color,
              color: 'white',
              borderColor: crypto.color
            }}
          >
            {crypto.id}
          </button>
        ))}
      </div>

      {/* Selected crypto info */}
      <div className="bg-black bg-opacity-60 p-3 rounded-lg border-2 mb-3" style={{ borderColor: selectedData.color }}>
        <div className="text-center">
          <div className="text-xs text-gray-400">{selectedData.name}</div>
          <div className="text-2xl font-bold pixel-font mt-1 flex items-center justify-center gap-2" style={{ color: selectedData.color }}>
            {currentPrice.toFixed(2)} ₿
            {isUp ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Você tem: {formatNumber(portfolio[selectedCrypto] || 0)} {selectedCrypto}
          </div>
        </div>

        {/* Mini chart */}
        <div className="mt-3 h-20 relative">
          <svg width="100%" height="100%" className="absolute inset-0">
            <polyline
              fill="none"
              stroke={selectedData.color}
              strokeWidth="2"
              points={history.map((price, i) => {
                const x = (i / (history.length - 1)) * 100;
                const minPrice = Math.min(...history);
                const maxPrice = Math.max(...history);
                const y = 100 - ((price - minPrice) / (maxPrice - minPrice || 1)) * 100;
                return `${x}%,${y}%`;
              }).join(' ')}
            />
          </svg>
        </div>
      </div>

      {/* Trading buttons */}
      <div className="space-y-2 mb-3">
        {/* Buy buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => buy(selectedCrypto, 1)}
            disabled={bitCoins < currentPrice}
            className="retro-button bg-green-600 text-white p-2 rounded text-xs pixel-font disabled:opacity-30"
            style={{ borderColor: '#00ff41' }}
          >
            +1
          </button>
          <button
            onClick={() => buy(selectedCrypto, 10)}
            disabled={bitCoins < currentPrice * 10}
            className="retro-button bg-green-600 text-white p-2 rounded text-xs pixel-font disabled:opacity-30"
            style={{ borderColor: '#00ff41' }}
          >
            +10
          </button>
          <button
            onClick={() => buyMax(selectedCrypto)}
            disabled={maxCanBuy === 0}
            className="retro-button bg-green-700 text-white p-2 rounded text-xs pixel-font disabled:opacity-30 flex items-center justify-center gap-1"
            style={{ borderColor: '#00ff41' }}
          >
            <ArrowUpCircle className="w-3 h-3" />
            MAX
          </button>
        </div>

        {/* Max buy info */}
        {maxCanBuy > 0 && (
          <div className="text-center text-green-400 text-xs">
            Máx: {formatNumber(maxCanBuy)} unidades
          </div>
        )}

        {/* Sell buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => sell(selectedCrypto, 1)}
            disabled={maxCanSell < 1}
            className="retro-button bg-red-600 text-white p-2 rounded text-xs pixel-font disabled:opacity-30"
            style={{ borderColor: '#ff0041' }}
          >
            -1
          </button>
          <button
            onClick={() => sell(selectedCrypto, 10)}
            disabled={maxCanSell < 10}
            className="retro-button bg-red-600 text-white p-2 rounded text-xs pixel-font disabled:opacity-30"
            style={{ borderColor: '#ff0041' }}
          >
            -10
          </button>
          <button
            onClick={() => sellMax(selectedCrypto)}
            disabled={maxCanSell === 0}
            className="retro-button bg-red-700 text-white p-2 rounded text-xs pixel-font disabled:opacity-30 flex items-center justify-center gap-1"
            style={{ borderColor: '#ff0041' }}
          >
            <ArrowDownCircle className="w-3 h-3" />
            MAX
          </button>
        </div>

        {/* Max sell info */}
        {maxCanSell > 0 && (
          <div className="text-center text-red-400 text-xs">
            Máx: {formatNumber(maxCanSell)} unidades = {formatNumber(maxCanSell * currentPrice * (techTree.marketBonus || 1))} ₿
          </div>
        )}
      </div>

      {/* Portfolio summary */}
      <div className="bg-black bg-opacity-60 p-3 rounded-lg border border-purple-400">
        <div className="text-purple-400 text-xs pixel-font mb-2 text-center">
          SEU PORTFOLIO
        </div>
        <div className="space-y-1">
          {CRYPTOS.map(crypto => {
            const owned = portfolio[crypto.id] || 0;
            const value = owned * prices[crypto.id];
            return (
              <div key={crypto.id} className="flex justify-between text-xs">
                <span style={{ color: crypto.color }}>{crypto.id}:</span>
                <span className="text-gray-300">
                  {formatNumber(owned)} ({formatNumber(value)} ₿)
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 pt-2 border-t border-purple-400 text-xs text-center">
          <span className="text-yellow-400">TOTAL: </span>
          <span className="text-green-400 font-bold">
            {formatNumber(
              Object.keys(portfolio).reduce((sum, key) => 
                sum + (portfolio[key] || 0) * prices[key], 0
              )
            )} ₿
          </span>
        </div>
      </div>
    </div>
  );
}
