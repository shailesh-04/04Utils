    type Color = 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'white';

/**
 * Prints colored text to console
 * @param text Text to print
 * @param color Color of the text
 */
export const printColorConsole = (text: string, color: Color = 'white'): void => {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };
  const reset = '\x1b[0m';
  console.log(`${colors[color]}${text}${reset}`);
};

// Add more console utilities as needed