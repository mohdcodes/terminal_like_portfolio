import React, { useState, useRef, useEffect } from 'react';

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ onSubmit, disabled = false }) => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
    
    // Keep focus on input when clicking anywhere in the terminal
    const handleClick = (e: MouseEvent) => {
      // Only focus if clicking within the terminal window, not the AI chatbot
      const target = e.target as HTMLElement;
      const isInAiChatbot = target.closest('.ai-chatbot-container');
      
      if (!isInAiChatbot && inputRef.current && !disabled) {
        inputRef.current.focus();
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input);
      setCommandHistory(prev => [input, ...prev]);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0 && newIndex < commandHistory.length) {
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(commandHistory[newIndex]);
      } else {
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for commands
      const commands = ['help', 'clear', 'arbaazcode'];
      const inputLower = input.toLowerCase();
      
      for (const cmd of commands) {
        if (cmd.startsWith(inputLower) && cmd !== inputLower) {
          setInput(cmd);
          break;
        }
      }
      
      // Handle arbaazcode subcommands
      if (inputLower.startsWith('arbaazcode ')) {
        const subcommands = ['project', 'about', 'contact', 'home', 'ai'];
        const inputParts = inputLower.split(' ');
        
        if (inputParts.length === 2 && inputParts[1] === '') {
          // If just "arbaazcode " is typed, suggest the first subcommand
          setInput(`arbaazcode ${subcommands[0]}`);
        } else if (inputParts.length === 2) {
          // Try to complete the subcommand
          const subCmd = inputParts[1];
          for (const cmd of subcommands) {
            if (cmd.startsWith(subCmd) && cmd !== subCmd) {
              setInput(`arbaazcode ${cmd}`);
              break;
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex items-center">
      <span className="mr-2 text-orange-500 font-semibold">$</span>
      <form onSubmit={handleSubmit} className="flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none caret-transparent text-cyan-400"
          autoFocus
          autoComplete="off"
          spellCheck="false"
          disabled={disabled}
        />
      </form>
      <div className="cursor-blink ml-1"></div>
    </div>
  );
};