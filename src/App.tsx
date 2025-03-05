import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from './components/Terminal';
import { CommandProcessor } from './utils/CommandProcessor';
import { TerminalHeader } from './components/TerminalHeader';
import { AiChatbot } from './components/AiChatbot';
import { generateAsciiArt } from './utils/asciiArt';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [showAiChatbot, setShowAiChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const commandProcessor = useRef(new CommandProcessor());
  
  useEffect(() => {
    const initializeTerminal = async () => {
      setIsLoading(true);
      try {
        // Split the ASCII art into separate lines for proper display
        const asciiArt = [
          "'   █████╗ ██████╗ ██████╗  █████╗  █████╗ ███████╗ ██████╗ ██████╗ ██████╗ ███████╗",
          "'  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚══███╔╝██╔════╝██╔═══██╗██╔══██╗██╔════╝",
          "'  ███████║██████╔╝██████╔╝███████║███████║  ███╔╝ ██║     ██║   ██║██║  ██║█████╗  ",
          "'  ██╔══██║██╔══██╗██╔══██╗██╔══██║██╔══██║ ███╔╝  ██║     ██║   ██║██║  ██║██╔══╝  ",
          "'  ██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║███████╗╚██████╗╚██████╔╝██████╔╝███████╗",
          "'  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝",
          "'                                                                                   "
        ];
        
        setHistory([
          ...asciiArt,
          "",
          "Welcome to ArbaazCode Terminal Portfolio v1.0.0",
          "Type 'help' to see available commands.",
          ""
        ]);
      } catch (error) {
        setHistory([
          "Welcome to ArbaazCode Terminal Portfolio v1.0.0",
          "Type 'help' to see available commands.",
          ""
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeTerminal();
  }, []);
  
  const processCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (trimmedCommand === 'arbaazcode ai') {
      setShowAiChatbot(true);
      setHistory(prev => ["$ " + command, "Starting AI assistant...", ""]);
      return;
    }
    
    const output = commandProcessor.current.process(command);
    setHistory(["$ " + command, ...output, ""]);
  };
  
  const clearTerminal = () => {
    setHistory(["Terminal cleared.", ""]);
  };

  const closeAiChatbot = () => {
    setShowAiChatbot(false);
    setHistory(prev => ["AI assistant closed.", ""]);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className={`w-full ${showAiChatbot ? 'max-w-[55%]' : 'max-w-4xl'} h-[85vh] terminal-window flex flex-col transition-all duration-300`}>
        <TerminalHeader />
        <Terminal 
          history={history} 
          onCommand={processCommand} 
          onClear={clearTerminal}
          isLoading={isLoading}
        />
      </div>
      
      {showAiChatbot && (
        <div className="w-[40%] h-[85vh] ml-4 terminal-window flex flex-col ai-chatbot-container">
          <AiChatbot onClose={closeAiChatbot} />
        </div>
      )}
    </div>
  );
}

export default App;