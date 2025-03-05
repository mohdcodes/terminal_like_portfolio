import userData from '../../db/data.json';

export class CommandProcessor {
  private commands: Record<string, (args: string[]) => string[]> = {
    help: this.helpCommand.bind(this),
    arbaazcode: this.arbaazCodeCommand.bind(this),
  };

  process(input: string): string[] {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      return [];
    }

    const [command, ...args] = trimmedInput.split(' ');
    
    if (command in this.commands) {
      return this.commands[command](args);
    }
    
    return [
      `Command not found: ${command}`,
      "Type 'help' to see available commands.",
      "",
      "💡 Pro tip: Try using the AI assistant with 'arbaazcode ai' for a more interactive experience!"
    ];
  }

  private helpCommand(args: string[]): string[] {
    return [
      "=== 🚀 Available Commands ===",
      "",
      "<div class='p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30 mb-4'>",
      "  <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>",
      "    <div class='command-group'>",
      "      <h3 class='text-cyan-400 font-bold mb-2'>Core Commands</h3>",
      "      <ul class='space-y-2'>",
      "        <li><span class='text-orange-400'>help</span> - Show this help message</li>",
      "        <li><span class='text-orange-400'>clear</span> - Clear the terminal</li>",
      "      </ul>",
      "    </div>",
      "    <div class='command-group'>",
      "      <h3 class='text-cyan-400 font-bold mb-2'>Portfolio Navigation</h3>",
      "      <ul class='space-y-2'>",
      "        <li><span class='text-orange-400'>arbaazcode project</span> - View my projects</li>",
      "        <li><span class='text-orange-400'>arbaazcode about</span> - Learn about me</li>",
      "        <li><span class='text-orange-400'>arbaazcode contact</span> - Get my contact info</li>",
      "        <li><span class='text-orange-400'>arbaazcode home</span> - Return home</li>",
      "        <li><span class='text-orange-400'>arbaazcode ai</span> - Launch AI assistant</li>",
      "      </ul>",
      "    </div>",
      "  </div>",
      "</div>",
      "",
      "<div class='p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg backdrop-blur-sm border border-green-500/30'>",
      "  <h3 class='text-cyan-400 font-bold mb-2'>Keyboard Shortcuts</h3>",
      "  <ul class='space-y-2'>",
      "    <li>⬆️ <span class='text-gray-300'>Up Arrow</span> - Previous command</li>",
      "    <li>⬇️ <span class='text-gray-300'>Down Arrow</span> - Next command</li>",
      "    <li>⇥ <span class='text-gray-300'>Tab</span> - Auto-complete command</li>",
      "  </ul>",
      "</div>"
    ];
  }

  private arbaazCodeCommand(args: string[]): string[] {
    if (args.length === 0) {
      return [
        "<div class='p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30'>",
        "  <h2 class='text-xl font-bold text-purple-300 mb-3'>ArbaazCode Command Usage</h2>",
        "  <p class='text-gray-300 mb-4'>Format: <span class='text-orange-400'>arbaazcode [command]</span></p>",
        "  <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>",
        "    <div class='space-y-2'>",
        "      <h3 class='text-cyan-400 font-bold'>Available Commands:</h3>",
        "      <ul class='space-y-1'>",
        "        <li>• project</li>",
        "        <li>• about</li>",
        "        <li>• contact</li>",
        "        <li>• home</li>",
        "        <li>• ai</li>",
        "      </ul>",
        "    </div>",
        "    <div class='space-y-2'>",
        "      <h3 class='text-cyan-400 font-bold'>Quick Tips:</h3>",
        "      <ul class='space-y-1'>",
        "        <li>• Use Tab for auto-completion</li>",
        "        <li>• Commands are case-insensitive</li>",
        "        <li>• Type 'help' for more info</li>",
        "      </ul>",
        "    </div>",
        "  </div>",
        "</div>"
      ];
    }

    const subcommand = args[0].toLowerCase();
    
    switch (subcommand) {
      case 'project':
        return this.projectCommand();
      case 'about':
        return this.aboutCommand();
      case 'contact':
        return this.contactCommand();
      case 'home':
        return this.homeCommand();
      case 'ai':
        return ["Starting AI assistant..."];
      default:
        return [
          `Unknown subcommand: ${subcommand}`,
          "Type 'arbaazcode' to see available subcommands.",
          "",
          "💡 Tip: Use Tab key for command auto-completion!"
        ];
    }
  }

  private projectCommand(): string[] {
    const output = [
      "<div class='mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg backdrop-blur-sm border border-blue-500/30'>",
      "  <h2 class='text-2xl font-bold text-blue-300 mb-4'>🚀 Featured Projects</h2>",
      "  <p class='text-gray-300 mb-4'>Explore my latest work and contributions to the tech community.</p>",
      "</div>"
    ];
    
    Object.entries(userData.projects).forEach(([name, details]) => {
      output.push(`
        <div class='group mb-6 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1'>
          <div class='flex flex-col md:flex-row gap-6'>
            <div class='md:w-1/3'>
              <h3 class='text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent'>${name}</h3>
            </div>
            <div class='md:w-2/3 flex flex-col'>
              <p class='text-green-400 mb-4 leading-relaxed'>${details.description}</p>
              <a href="${details.github}" target="_blank" class='flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300'>
                <span class='mr-2'>View on GitHub</span>
                <svg class='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                  <polyline points='15 3 21 3 21 9'></polyline>
                  <line x1='10' y1='14' x2='21' y2='3'></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `);
    });
    
    return output;
  }

  private aboutCommand(): string[] {
    return [
      "<div class='space-y-6'>",
      "  <div class='p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl backdrop-blur-sm border border-purple-500/30'>",
      "    <h2 class='text-2xl font-bold text-purple-300 mb-4'>👋 About Me</h2>",
      "    <div class='prose prose-invert'>",
      `      <p class='text-xl text-gray-300 leading-relaxed'>${userData.about.bio}</p>`,
      "    </div>",
      "  </div>",
      "</div>"
    ];
  }

  private contactCommand(): string[] {
    const output = [
      "<div class='space-y-6'>",
      "  <div class='p-6 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-xl backdrop-blur-sm border border-green-500/30'>",
      "    <h2 class='text-2xl font-bold text-green-300 mb-4'>📬 Let's Connect!</h2>",
      "    <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>"
    ];
    
    Object.entries(userData.contact).forEach(([platform, link]) => {
      const icon = this.getPlatformIcon(platform);
      output.push(`
        <a href="${platform.toLowerCase() === 'email' ? `mailto:${link}` : link}" 
           target="${platform.toLowerCase() === 'email' ? '_self' : '_blank'}"
           class='group p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1'>
          <div class='flex items-center space-x-3'>
            ${icon}
            <div>
              <h3 class='text-lg font-semibold text-gray-300'>${platform}</h3>
              <p class='text-gray-400 group-hover:text-cyan-400 transition-colors'>${link}</p>
            </div>
          </div>
        </a>
      `);
    });
    
    output.push(
      "    </div>",
      "  </div>",
      "</div>"
    );
    
    return output;
  }

  private getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      LinkedIn: `<svg class='w-6 h-6 text-blue-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'/><rect x='2' y='9' width='4' height='12'/><circle cx='4' cy='4' r='2'/></svg>`,
      GitHub: `<svg class='w-6 h-6 text-purple-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'/></svg>`,
      LeetCode: `<svg class='w-6 h-6 text-yellow-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'/><rect x='2' y='9' width='4' height='12'/><circle cx='4' cy='4' r='2'/></svg>`,
      Email: `<svg class='w-6 h-6 text-red-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>`
    };
    
    return icons[platform] || `<svg class='w-6 h-6 text-gray-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/></svg>`;
  }

  private homeCommand(): string[] {
    const asciiArt = [
      "'   █████╗ ██████╗ ██████╗  █████╗  █████╗ ███████╗ ██████╗ ██████╗ ██████╗ ███████╗",
      "'  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚══███╔╝██╔════╝██╔═══██╗██╔══██╗██╔════╝",
      "'  ███████║██████╔╝██████╔╝███████║███████║  ███╔╝ ██║     ██║   ██║██║  ██║█████╗  ",
      "'  ██╔══██║██╔══██╗██╔══██╗██╔══██║██╔══██║ ███╔╝  ██║     ██║   ██║██║  ██║██╔══╝  ",
      "'  ██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║███████╗╚██████╗╚██████╔╝██████╔╝███████╗",
      "'  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝",
      "'                                                                                   "
    ];
    
    return [
      ...asciiArt,
      "",
      "<div class='p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30 mb-6'>",
      "  <h1 class='text-2xl font-bold text-blue-300 mb-4'>Welcome to ArbaazCode Terminal Portfolio v1.0.0</h1>",
      "  <p class='text-gray-300 leading-relaxed mb-4'>This interactive terminal allows you to explore my portfolio using simple commands.</p>",
      "  <div class='flex space-x-4'>",
      "    <span class='px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm'>Type 'help' for commands</span>",
      "    <span class='px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm'>Press Tab to auto-complete</span>",
      "  </div>",
      "</div>",
      "",
      "<div class='p-6 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-xl backdrop-blur-sm border border-green-500/30'>",
      "  <h2 class='text-xl font-bold text-green-300 mb-4'>🌟 Quick Start</h2>",
      "  <ul class='space-y-2 text-gray-300'>",
      "    <li>• Type <span class='text-orange-400'>arbaazcode project</span> to view my projects</li>",
      "    <li>• Type <span class='text-orange-400'>arbaazcode about</span> to learn about me</li>",
      "    <li>• Type <span class='text-orange-400'>arbaazcode contact</span> to get in touch</li>",
      "    <li>• Type <span class='text-orange-400'>arbaazcode ai</span> to chat with AI assistant</li>",
      "  </ul>",
      "</div>"
    ];
  }
}