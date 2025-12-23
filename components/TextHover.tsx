import React from 'react';

interface TextHoverProps {
  children: string;
  className?: string;
  stroke?: boolean;
  hoverColor?: 'neon' | 'white' | 'black' | 'contrast';
  underlinedWords?: string[];
}

export const TextHover: React.FC<TextHoverProps> = ({ 
  children, 
  className = '', 
  stroke = false,
  hoverColor = 'neon',
  underlinedWords = []
}) => {
  const words = children.split(' ');

  const getHoverClass = () => {
    if (hoverColor === 'white') return 'hover:text-offwhite';
    if (hoverColor === 'black') return 'hover:text-black';
    // Standard Theme: Light Mode (Black Text) -> Hover Neon/White? Let's use Neon standardly.
    // But for "contrast" specific requests (like on Red BG):
    // In Light Mode (Red BG, White Text) -> Hover Black
    // In Dark Mode (Red BG, Black Text) -> Hover OffWhite
    if (hoverColor === 'contrast') return 'hover:text-black dark:hover:text-offwhite';
    return 'hover:text-neon';
  };

  return (
    <span className={`${className} inline pointer-events-auto whitespace-pre-wrap`}>
      {words.map((word, wordIndex) => {
        // Strip punctuation for matching but render original word
        const cleanWord = word.replace(/[.,;!?]/g, '');
        const isUnderlined = underlinedWords.includes(cleanWord);
        
        return (
        <React.Fragment key={wordIndex}>
          <span 
            className={`
              inline-block cursor-default
              transition-colors duration-300 delay-100 ease-out
              hover:transition-none
              ${stroke 
                ? `text-transparent ${getHoverClass()}` 
                : getHoverClass()}
              ${isUnderlined ? 'border-b-4 border-black dark:border-offwhite' : ''}
            `}
            style={stroke ? { WebkitTextStroke: '2px var(--text-stroke-color)' } : undefined}
          >
            {word}
          </span>
          {wordIndex < words.length - 1 && ' '}
        </React.Fragment>
      )})}
    </span>
  );
};

export default TextHover;