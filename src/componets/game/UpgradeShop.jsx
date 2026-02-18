import { useState } from 'react';
import { Zap, Cpu, Building2, Rocket } from 'lucide-react';

const UPGRADES = [
  {
    id: 'gpu',
    name: 'Placa de Vídeo Usada',
    baseCost: 50,
    baseBps: 1,
    icon: '🎮',
    description: 'Uma GPU barulhenta mas funcional',
    category: 'hardware'
  },
  {
    id: 'asic',
    name: 'ASIC Genérico',
    baseCost: 500,
    baseBps: 15,
    icon: '⚡',
    description: 'Minerador especializado',
    category: 'hardware'
  },
  {
    id: 'cpu_cluster',
    name: 'Cluster de CPUs',
    baseCost: 2000,
    baseBps: 50,
    icon: '💻',
    description: 'Processamento em paralelo',
    category: 'hardware'
  },
  {
    id: 'quantum_chip',
    name: 'Chip Quântico',
    baseCost: 10000,
    baseBps: 250,
    icon: '🔬',
    description: 'Tecnologia de ponta',
    category: 'hardware'
  },
  {
    id: 'farm',
    name: 'Fazenda (Galpão)',
    baseCost: 5000,
    baseBps: 100,
    icon: '🏭',
    description: 'Racks de mineração em galpão',
    category: 'industrial'
  },
  {
    id: 'datacenter',
    name: 'Data Center Subterrâneo',
    baseCost: 50000,
    baseBps: 1000,
    icon: '🏢',
    description: 'Complexo industrial de mineração',
    category: 'industrial'
  },
  {
    id: 'nuclear_plant',
    name: 'Usina Nuclear',
    baseCost: 250000,
    baseBps: 5000,
    icon: '⚛️',
    description: 'Energia nuclear para mineração',
    category: 'industrial'
  },
  {
    id: 'ocean_platform',
    name: 'Plataforma Oceânica',
    baseCost: 500000,
    baseBps: 10000,
    icon: '🌊',
    description: 'Mineração submarina refrigerada',
    category: 'industrial'
  },
  {
    id: 'orbital',
    name: 'Estação Orbital',
    baseCost: 1000000,
    baseBps: 25000,
    icon: '🛰️',
    description: 'Mineração no espaço!',
    category: 'espacial'
  },
  {
    id: 'moon_base',
    name: 'Base Lunar',
    baseCost: 5000000,
    baseBps: 100000,
    icon: '🌙',
    description: 'Mineração na superfície da Lua',
    category: 'espacial'
  },
  {
    id: 'planet_bit',
    name: 'Planeta Bit',
    baseCost: 50000000,
    baseBps: 500000,
    icon: '🪐',
    description: 'Um planeta inteiro dedicado à mineração',
    category: 'espacial'
  },
  {
    id: 'universe_bit',
    name: 'Universo Bit',
    baseCost: 500000000,
    baseBps: 2500000,
    icon: '🌌',
    description: 'Controle de um universo paralelo',
    category: 'espacial'
  },
  {
    id: 'antimatter_bit',
    name: 'Anti-Matéria Bit',
    baseCost: 5000000000,
    baseBps: 15000000,
    icon: '💫',
    description: 'Energia infinita da anti-matéria',
    category: 'espacial'
  },
  {
    id: 'black_hole',
    name: 'Buraco Negro',
    baseCost: 50000000000,
    baseBps: 100000000,
    icon: '🕳️',
    description: 'Singularidade geradora de Bit-Moedas',
    category: 'espacial'
  },
  {
    id: 'multiverse',
    name: 'Multiverso',
    baseCost: 500000000000,
    baseBps: 750000000,
    icon: '♾️',
    description: 'Mineração através de múltiplas realidades',
    category: 'espacial'
  },
];

const TABS = [
  { id: 'hardware', name: 'Hardware', icon: Cpu, color: 'cyan' },
  { id: 'industrial', name: 'Industrial', icon: Building2, color: 'purple' },
  { id: 'espacial', name: 'Espacial', icon: Rocket, color: 'pink' },
];

export default function UpgradeShop({ bitCoins, setBitCoins, upgrades, setUpgrades, bps, setBps, techTree }) {
  const [activeTab, setActiveTab] = useState('hardware');

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
  };

  const getCost = (upgrade) => {
    const owned = upgrades[upgrade.id] || 0;
    const discount = techTree.discount || 1;
    return Math.floor(upgrade.baseCost * Math.pow(1.15, owned) * discount);
  };

  const getBpsGain = (upgrade) => {
    const efficiency = techTree.efficiency || 1;
    return upgrade.baseBps * efficiency;
  };

  const buyUpgrade = (upgrade) => {
    const cost = getCost(upgrade);
    if (bitCoins >= cost) {
      setBitCoins(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1
      }));
      setBps(prev => prev + getBpsGain(upgrade));
    }
  };

  const filteredUpgrades = UPGRADES.filter(u => u.category === activeTab);

  return (
    <div className="retro-border bg-gradient-to-br from-gray-900 to-blue-900 p-4 rounded-lg">
      <div className="text-cyan-400 text-sm pixel-font mb-3 text-center flex items-center justify-center gap-2">
        <Zap className="w-4 h-4" />
        LOJA DE UPGRADES
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-2 rounded text-xs pixel-font retro-button transition-all ${
                isActive ? 'bg-opacity-80 scale-95' : 'bg-opacity-40'
              }`}
              style={{
                backgroundColor: isActive ? `var(--${tab.color})` : '#1a1a1a',
                color: isActive ? 'white' : `var(--${tab.color})`,
                borderColor: `var(--${tab.color})`
              }}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {filteredUpgrades.map(upgrade => {
          const owned = upgrades[upgrade.id] || 0;
          const cost = getCost(upgrade);
          const canAfford = bitCoins >= cost;
          const bpsGain = getBpsGain(upgrade);

          return (
            <div
              key={upgrade.id}
              className={`bg-black bg-opacity-60 p-3 rounded-lg border-2 transition-all ${
                canAfford 
                  ? 'border-green-400 hover:bg-opacity-80 cursor-pointer hover:scale-102' 
                  : 'border-gray-600 opacity-50'
              }`}
              onClick={() => canAfford && buyUpgrade(upgrade)}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{upgrade.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-yellow-400 text-xs pixel-font leading-tight">
                      {upgrade.name}
                    </div>
                    {owned > 0 && (
                      <div className="text-green-400 text-xs pixel-font shrink-0">
                        x{owned}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {upgrade.description}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-cyan-400 text-xs">
                      +{formatNumber(bpsGain)} BPS
                    </div>
                    <div className={`text-xs pixel-font ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                      {formatNumber(cost)} ₿
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {owned > 0 && (
                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all"
                    style={{ width: `${Math.min((owned / 50) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-3 p-2 bg-black bg-opacity-60 rounded border border-cyan-400">
        <div className="text-cyan-400 text-xs pixel-font text-center">
          UPGRADES TOTAIS: {Object.values(upgrades).reduce((sum, val) => sum + val, 0)}
        </div>
      </div>

      <style>{`
        :root {
          --cyan: #00d4ff;
          --purple: #b026ff;
          --pink: #ff26d4;
        }
      `}</style>
    </div>
  );
}
