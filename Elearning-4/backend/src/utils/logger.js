import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
  static logDir = path.join(__dirname, '../../logs');

  static ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  static getLogFile() {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `app-${date}.log`);
  }

  static writeLog(level, message) {
    this.ensureLogDirectory();
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
    
    fs.appendFileSync(this.getLogFile(), logMessage);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(logMessage.trim());
    }
  }

  static info(message) {
    this.writeLog('info', message);
  }

  static error(message) {
    this.writeLog('error', message);
  }

  static warn(message) {
    this.writeLog('warn', message);
  }

  static debug(message) {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog('debug', message);
    }
  }
}

export default Logger;