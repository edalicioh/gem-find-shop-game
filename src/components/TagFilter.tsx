import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-neon-purple/10 ${
            selectedTag === tag
              ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white neon-glow border border-neon-purple/50'
              : 'bg-dark-700/50 text-gray-300 border border-gray-600/30 hover:border-neon-purple/30'
          }`}
        >
          <span className="block font-medium">{tag}</span>
        </button>
      ))}
    </div>
  );
};

export default TagFilter;