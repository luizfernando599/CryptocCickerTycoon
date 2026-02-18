import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';

export default function HackerAttack({ onComplete }) {
  const [windows, setWindows] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const targetScore = 10;

  useEffect(() => {
    // Spawn virus windows
    const interval = setInterval(() => {
      const newWindow = {
        id: Date.now(),
        x: Math.random() * 80,
        y: Math.random() * 70,
      };
      setWindows(prev => [...prev, newWindow]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(score >= targetScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, onComplete]);

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setScore(prev => prev + 1);
    
    if (score + 1 >= targetScore) {
      onComplete(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-red-900 bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="retro-border bg-black p-6 max-w-4xl w-full relative" style={{ borderColor: '#ff0041' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-red-500 pixel-font text-2xl animate-pulse mb-2">
            ⚠️ ATAQUE HACKER ⚠️
          </div>
          <div className="text-yellow-400 pixel-font text-sm mb-2">
            FECHE AS JANELAS DE VÍRUS!
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <div className="text-cyan-400">
              Tempo: <span className="text-white font-bold">{timeLeft}s</span>
            </div>
            <div className="text-green-400">
              Progresso: <span className="text-white font-bold">{score}/{targetScore}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all"
            style={{ width: `${(score / targetScore) * 100}%` }}
          />
        </div>

        {/* Game area */}
        <div className="relative h-96 bg-gray-900 rounded-lg border-2 border-red-500 overflow-hidden">
          {windows.map(window => (
            <div
              key={window.id}
              className="absolute retro-border bg-red-900 p-2 cursor-pointer hover:scale-110 transition-transform animate-bounce"
              style={{ 
                left: `${window.x}%`,
                top: `${window.y}%`,
                borderColor: '#ff0041'
              }}
              onClick={() => closeWindow(window.id)}
            >
              <div className="flex items-center gap-2">
                <div className="text-red-500 text-xl">🦠</div>
                <div className="text-white pixel-font text-xs">VIRUS.EXE</div>
                <button className="text-white hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {windows.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-16 h-16 text-green-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 text-gray-400 text-xs">
          Clique nas janelas vermelhas para fechá-las!
        </div>
      </div>
    </div>
  );
}
