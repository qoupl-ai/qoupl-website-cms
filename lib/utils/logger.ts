/**
 * Simple logging utility for CMS
 * Logs only in development mode to avoid console spam in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[CMS]', ...args)
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors
    console.error('[CMS Error]', ...args)
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[CMS Warning]', ...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[CMS Info]', ...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment && process.env.DEBUG === 'true') {
      console.debug('[CMS Debug]', ...args)
    }
  },
}

