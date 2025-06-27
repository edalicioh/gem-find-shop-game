
import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`tag-button ${
            selectedTag === tag
              ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white neon-glow'
              : ''
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
