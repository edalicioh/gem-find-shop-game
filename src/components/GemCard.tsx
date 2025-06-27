
import React from 'react';
import { Download, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemCardProps {
  name: string;
  type: string;
  rarity: string;
  link?: string;
}

const GemCard: React.FC<GemCardProps> = ({ name, type, rarity, link }) => {
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
         
          <div>
          <h3 className="text-white font-semibold text-lg overflow-hidden text-ellipsis line-clamp-2">{name}</h3>
            <p className="text-gray-400 text-sm">{type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${getRarityColor(rarity)}`}>{rarity}</p>
        </div>
      </div>
      
      <a href={link} target="_blank" rel="noopener noreferrer">
      <Button 
        className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-purple/30"
      >
        <Download className="h-4 w-4 mr-2" />
        Baixar Gema
      </Button>
      </a>
    </div>
  );
};

export default GemCard;
