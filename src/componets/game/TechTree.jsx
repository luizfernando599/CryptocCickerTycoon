import { Zap, TrendingUp, Snowflake, Shield } from 'lucide-react';

const TECHS = [
  {
    id: 'clickBoost',
    name: 'Click Boost',
    description: 'Dobra o poder de clique',
    cost: 1000,
    icon: Zap,
    effect: 2,
    color: '#ffff00'
  },
  {
    id: 'efficiency',
    name: 'Otimização de Código',
    description: 'Upgrades 50% mais eficientes',
    cost: 5000,
    icon: TrendingUp,
    effect: 1.5,
    color: '#00ff41'
  },
  {
    id: 'discount',
    name: 'Lobbying',
    description: 'Upgrades 20% mais baratos',
    cost: 10000,
    icon: Shield,
    effect: 0.8,
    color: '#00d4ff'
  },
  {
    id: 'marketBonus',
    name: 'Visão de Mercado',
    description: 'Vendas rendem 25% a mais',
    cost: 8000,
    icon: TrendingUp,
    effect: 1.25,
    color: '#b026ff'
  },
];

export default function TechTree({ bitCoins, setBitCoins, techTree, setTechTree, setBps }) {
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
  };

  const buyTech = (tech) => {
    if (bitCoins >= tech.cost && !techTree[tech.id]) {
      setBitCoins(prev => prev - tech.cost);
      setTechTree(prev => ({
        ...prev,
        [tech.id]: tech.effect
      }));

      // Special effect for efficiency - update BPS
      if (tech.id === 'efficiency') {
        setBps(prev => prev * 1.5);
      }
    }
  };

  return (
    <div className="retro-border bg-gradient-to-br from-gray-900 to-orange-900 p-4 rounded-lg">
      <div className="text-orange-400 text-sm pixel-font mb-3 text-center">
        ÁRVORE TECNOLÓGICA
      </div>

      <div className="space-y-2">
        {TECHS.map(tech => {
          const owned = !!techTree[tech.id];
          const canAfford = bitCoins >= tech.cost && !owned;
          const Icon = tech.icon;

          return (
            <div
              key={tech.id}
              className={`bg-black bg-opacity-60 p-3 rounded-lg border-2 transition-all ${
                owned
                  ? 'border-green-400'
                  : canAfford
                  ? 'border-yellow-400 hover:bg-opacity-80 cursor-pointer'
                  : 'border-gray-600 opacity-50'
              }`}
              onClick={() => canAfford && buyTech(tech)}
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`p-2 rounded ${owned ? 'bg-green-900' : 'bg-gray-900'}`}
                  style={{ borderColor: tech.color, borderWidth: '2px' }}
                >
                  <Icon className="w-5 h-5" style={{ color: tech.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-yellow-400 text-xs pixel-font">
                      {tech.name}
                    </div>
                    {owned && (
                      <div className="text-green-400 text-xs pixel-font">✓</div>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {tech.description}
                  </div>
                  {!owned && (
                    <div className={`text-xs mt-2 pixel-font ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      {formatNumber(tech.cost)} ₿
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-black bg-opacity-60 rounded border border-orange-400 text-center">
        <div className="text-orange-400 text-xs pixel-font">
          TECHS ATIVAS: {Object.keys(techTree).length}/{TECHS.length}
        </div>
      </div>
    </div>
  );
}
