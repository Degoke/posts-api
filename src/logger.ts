export enum LogLevel {
    NONE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
  }
  
  export const logger = {
    level: process.env.NODE_ENV === 'test' ? LogLevel.ERROR : LogLevel.INFO,
  
    error(msg: string, data?: Record<string, any>): void {
      if (logger.level >= LogLevel.ERROR) {
        logger.log('ERROR', msg, data);
      }
    },
  
    warn(msg: string, data?: Record<string, any>): void {
      if (logger.level >= LogLevel.WARN) {
        logger.log('WARN', msg, data);
      }
    },
  
    info(msg: string, data?: Record<string, any>): void {
      if (logger.level >= LogLevel.INFO) {
        logger.log('INFO', msg, data);
      }
    },
  
    debug(msg: string, data?: Record<string, any>): void {
      if (logger.level >= LogLevel.DEBUG) {
        logger.log('DEBUG', msg, data);
      }
    },
  
    log(level: string, msg: string, data?: Record<string, any>): void {
      if (data instanceof Error) {
        data = { error: data.toString() };
      }
      console.log(
        JSON.stringify({
          level,
          timestamp: new Date().toISOString(),
          msg,
          ...data,
        })
      );
    },
}
