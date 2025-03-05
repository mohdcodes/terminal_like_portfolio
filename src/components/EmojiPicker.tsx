import React from 'react';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '👏', '🤔'];
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800 rounded-lg p-2 shadow-lg"
    >
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {emojis.map((emoji, index) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(emoji)}
            className="text-xl p-1.5 hover:bg-gray-700 rounded-full cursor-pointer"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};