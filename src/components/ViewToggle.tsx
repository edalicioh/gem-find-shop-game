
import React from 'react';
import { Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={`${
          viewMode === 'grid'
            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
            : 'border-neon-purple/40 text-white hover:bg-neon-purple/20'
        }`}
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`${
          viewMode === 'list'
            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
            : 'border-neon-purple/40 text-white hover:bg-neon-purple/20'
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
