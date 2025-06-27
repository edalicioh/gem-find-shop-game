
import React from 'react';
import { Download, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemCardProps {
  name: string;
  type: string;
  price: string;
  rarity: string;
}

const GemCard: React.FC<GemCardProps> = ({ name, type, price, rarity }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Comum':
        return 'text-gray-400';
      case 'Raro':
        return 'text-neon-blue';
      case 'Épico':
        return 'text-neon-purple';
      case 'Lendário':
        return 'text-neon-pink';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="gem-card group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full flex items-center justify-center">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">{type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-neon-green font-bold text-lg">{price}</p>
          <p className={`text-sm font-medium ${getRarityColor(rarity)}`}>{rarity}</p>
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-purple/30"
      >
        <Download className="h-4 w-4 mr-2" />
        Baixar Gema
      </Button>
    </div>
  );
};

export default GemCard;
