import React from 'react';
import { Circle, Terminal as TerminalIcon } from 'lucide-react';

export const TerminalHeader: React.FC = () => {
  return (
    <div className="terminal-header p-3 flex items-center">
      <div className="flex space-x-2 mr-4">
        <Circle size={12} className="text-red-500 fill-current" />
        <Circle size={12} className="text-yellow-500 fill-current" />
        <Circle size={12} className="text-green-500 fill-current" />
      </div>
      <div className="flex-1 text-center text-sm text-gray-300 flex items-center justify-center">
        <TerminalIcon size={14} className="mr-2" />
        <span className="font-medium">arbaaz@portfolio</span>
        <span className="text-gray-400 mx-1">~</span>
        <span className="text-blue-400">/home/arbaaz</span>
      </div>
    </div>
  );
};