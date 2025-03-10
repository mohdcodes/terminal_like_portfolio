import { useRef, useEffect } from 'react';
import { TerminalInput } from './TerminalInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface TerminalProps {
  history: string[];
  onCommand: (command: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  history,
  onCommand,
  onClear,
  isLoading = false,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (command: string) => {
    if (command.trim().toLowerCase() === 'clear') {
      onClear();
    } else {
      onCommand(command);
    }
  };

  const formatLine = (line: string) => {
    // Check if line is part of ASCII art
    if (
      line.startsWith("'  ") ||
      line ===
        "'                                                                                   "
    ) {
      return <span className="ascii-art">{line}</span>;
    }

    // Check if line contains HTML tags for colored text or complex formatting
    if (line.includes('<') && line.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: line }} />;
    }

    if (line.startsWith('$ ')) {
      const command = line.substring(2);
      const parts = command.split(' ');

      if (parts[0] === 'arbaazcode' && parts.length > 1) {
        return (
          <>
            <span className="command-prompt">$ </span>
            <span className="command-keyword">arbaazcode</span>
            <span> </span>
            <span className="command-subcommand">
              {parts.slice(1).join(' ')} 
            </span>
          </>
        );
      }

      return (
        <>
          <span className="command-prompt">$ </span>
          <span className="command-keyword">{command}</span>
        </>
      );
    }

    if (line.startsWith('===')) {
      return <span className="command-result-title">{line}</span>;
    }

    if (line.includes('GitHub:')) {
      const parts = line.split('GitHub: ');
      return (
        <>
          {parts[0]}
          <span className="command-result-link">GitHub: {parts[1]}</span>
        </>
      );
    }

    if (
      line.includes('Technical Skills:') ||
      line.includes('Education:') ||
      line.includes('Contact Information')
    ) {
      return <span className="command-result-highlight">{line}</span>;
    }

    return line;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto terminal-scrollbar terminal-content px-16"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-green-400 mr-2" size={24} />
            <span>Initializing terminal...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={history[0] || 'empty'} // Use first line as key to trigger animations on command change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {history.map((line, index) => (
                <motion.div
                  key={index}
                  className="mb-1 terminal-line glow-text"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05 * Math.min(index, 5),
                  }}
                >
                  {formatLine(line)}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="terminal-input-container p-3">
        <TerminalInput onSubmit={handleCommand} disabled={isLoading} />
      </div>
    </div>
  );
};
