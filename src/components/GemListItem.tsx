
import React from 'react';
import { Download, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemListItemProps {
  name: string;
  type: string;
  rarity: string;
  link?: string;
  onClick?: () => void;
  image?: string;
}

const GemListItem: React.FC<GemListItemProps> = ({ name, type, rarity, link, onClick, image }) => {
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
    <div className="gem-list-item bg-dark-800 p-4 flex items-center justify-between cursor-pointer rounded-lg shadow-lg transition-all duration-300 hover:shadow-neon-purple/30 hover:scale-105" onClick={onClick}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img src={image || '/placeholder.svg'} alt={name} className="w-16 h-16 object-cover rounded-md" />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg overflow-hidden text-ellipsis line-clamp-1">{name}</h3>
          <p className="text-gray-400 text-sm">{type}</p>
        </div>
        <div className="text-right flex-shrink-0 mr-4">
          <p className={`text-sm font-medium ${getRarityColor(rarity)}`}>{rarity}</p>
        </div>
      </div>

      {/* Botão sempre no final do item */}
      <div className="flex-shrink-0">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-semibold transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
        </a>
      </div>
    </div>
  );
};

export default GemListItem;
