# 🚀 ArbaazCode Terminal Portfolio

A modern, interactive terminal-style portfolio website with AI integration and beautiful UI effects.

![Terminal Portfolio Demo](https://source.unsplash.com/random/1200x630/?coding,terminal)

## ✨ Features

- 🖥️ Terminal-like interface with modern UI
- 🤖 AI Assistant with dual modes (Personal & General)
- 🎨 Dynamic themes and animations
- 🔊 Voice input support
- 💬 Emoji reactions
- 🌓 Dark/Light mode
- 📱 Fully responsive design
- ⌨️ Command auto-completion
- 🔍 Interactive command history

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Google's Gemini AI
- React Speech Recognition
- Lucide Icons

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/terminal-portfolio.git
   cd terminal-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Customization

### Personal Data
Update the `db/data.json` file with your information:

```json
{
  "projects": {
    "Project Name": {
      "description": "Project description",
      "github": "GitHub URL"
    }
  },
  "about": {
    "bio": "Your bio"
  },
  "contact": {
    "LinkedIn": "Your LinkedIn URL",
    "GitHub": "Your GitHub URL",
    "Email": "your.email@example.com"
  }
}
```

### Theme Customization
- Modify colors in `tailwind.config.js`
- Update UI components in `src/components`
- Customize terminal styles in `src/index.css`

### AI Assistant
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the key in your `.env` file
3. Customize AI responses in `src/components/AiChatbot.tsx`

## 🎯 Available Commands

- `help` - Show available commands
- `clear` - Clear the terminal
- `arbaazcode project` - View projects
- `arbaazcode about` - Show about information
- `arbaazcode contact` - Display contact details
- `arbaazcode home` - Return to home screen
- `arbaazcode ai` - Launch AI assistant

## ⌨️ Keyboard Shortcuts

- `↑` / `↓` - Navigate command history
- `Tab` - Auto-complete commands
- `Enter` - Execute command

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion) for animations
- [Google Gemini](https://ai.google.dev) for AI capabilities

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.