
import React from 'react';
import { Download, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemListItemProps {
  name: string;
  type: string;
  price: string;
  rarity: string;
}

const GemListItem: React.FC<GemListItemProps> = ({ name, type, price, rarity }) => {
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
    <div className="gem-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full flex items-center justify-center flex-shrink-0">
          <Gem className="h-6 w-6 text-white" />
        </div>
        <div className="flex-grow">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className="text-gray-400 text-sm">{type}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-neon-green font-bold text-lg">{price}</p>
          <p className={`text-sm font-medium ${getRarityColor(rarity)}`}>{rarity}</p>
        </div>
        
        <Button 
          size="sm"
          className="bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-semibold transition-all duration-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar
        </Button>
      </div>
    </div>
  );
};

export default GemListItem;
