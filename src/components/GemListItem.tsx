
import React from 'react';
import { Download, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemListItemProps {
  name: string;
  type: string;
  rarity: string;
  link?: string;
}

const GemListItem: React.FC<GemListItemProps> = ({ name, type, rarity, link }) => {
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
        <div className="flex-grow">
          <h3 className="text-white font-semibold text-lg overflow-hidden text-ellipsis line-clamp-1">{name}</h3>
          <p className="text-gray-400 text-sm">{type}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">

        <a href={link} target="_blank" rel="noopener noreferrer">
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
