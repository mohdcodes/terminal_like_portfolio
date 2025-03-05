import figlet from 'figlet';

export const generateAsciiArt = (text: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    figlet.text(text, {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      
      const lines = data?.split('\n') || [];
      const coloredLines = lines.map(line => line);
      resolve(coloredLines);
    });
  });
};