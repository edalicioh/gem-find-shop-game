
import React from 'react';
import { Download, Gem, Calendar, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gem: {
    name: string;
    type: string;
    rarity: string;
    link?: string;
    description?: string;
    version?: string;
    size?: string;
    releaseDate?: string;
    image?: string;
  };
}

const GemDetailsModal: React.FC<GemDetailsModalProps> = ({ isOpen, onClose, gem }) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-neon-purple/30 text-white w-[80vw] max-h-[80vh] flex flex-col p-0">
        <img src={gem.image} alt={gem.name} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-6 flex-grow overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Gem className="h-5 w-5 text-neon-purple" />
            {gem.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Tipo</p>
              <p className="text-white font-medium">{gem.type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Raridade</p>
              <p className={`font-medium flex items-center gap-1 ${getRarityColor(gem.rarity)}`}>
                <Star className="h-4 w-4" />
                {gem.rarity}
              </p>
            </div>
          </div>

          {/* Informações adicionais */}
          {gem.version && (
            <div>
              <p className="text-gray-400 text-sm">Versão</p>
              <p className="text-white">{gem.version}</p>
            </div>
          )}

          {gem.size && (
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Package className="h-4 w-4" />
                Tamanho
              </p>
              <p className="text-white">{gem.size}</p>
            </div>
          )}

          {gem.releaseDate && (
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Data de Lançamento
              </p>
              <p className="text-white">{gem.releaseDate}</p>
            </div>
          )}

          {gem.description && (
            <div>
              <p className="text-gray-400 text-sm">Descrição</p>
              <p className="text-white text-sm leading-relaxed">{gem.description}</p>
            </div>
          )}

          {/* Botão de download */}
          <div className="pt-4 border-t border-gray-700">
            <a href={gem.link} target="_blank" rel="noopener noreferrer" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-semibold py-3 transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Gema
              </Button>
            </a>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GemDetailsModal;
