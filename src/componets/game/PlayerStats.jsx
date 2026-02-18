export default function PlayerStats({ bitCoins, bps, isPaused }) {
  const formatNumber = (num) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="retro-border bg-black bg-opacity-80 p-3 md:p-4 rounded-lg backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-yellow-400 text-xs pixel-font mb-1">BIT-MOEDAS</div>
          <div className="text-2xl md:text-3xl font-bold text-green-400 pixel-font crt-effect">
            {formatNumber(bitCoins)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-cyan-400 text-xs pixel-font mb-1">BPS</div>
          <div className="text-2xl md:text-3xl font-bold text-cyan-400 pixel-font crt-effect">
            {formatNumber(bps)}
          </div>
        </div>

        {isPaused && (
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-red-500 text-xs pixel-font mb-1 animate-pulse">
              ⚠️ SISTEMA PAUSADO
            </div>
            <div className="text-sm text-red-400 pixel-font">
              ATAQUE HACKER!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
