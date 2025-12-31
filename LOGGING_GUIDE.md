# CMS Logging Guide

## ✅ Logging Added!

I've added comprehensive logging to the CMS. Here's how to see the logs:

## 📊 Where to See Logs

### 1. Development Server (Local)

When running `npm run dev`, logs appear in your terminal:

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm run dev
```

You'll see logs like:
```
[Middleware] GET /add-content
[Middleware] Checking admin access for user: xxx
[Middleware] Admin access granted
[Supabase Server] Creating client...
[Supabase Admin] Admin client initialized successfully
```

### 2. Browser Console

Open browser DevTools (F12) → Console tab:
- Client-side logs appear here
- Look for `[CMS]`, `[CMS Error]`, `[CMS Warning]` prefixes

### 3. Vercel Deployment Logs

1. Go to Vercel Dashboard
2. Select your CMS project
3. Click **"Deployments"**
4. Click on a deployment
5. Click **"Build Logs"** or **"Function Logs"**

### 4. Server Actions Logs

Server Actions logs appear in:
- **Terminal** (when running `npm run dev`)
- **Vercel Function Logs** (in production)

## 🔍 What Gets Logged

### Middleware Logs
- Request method and path
- Authentication status
- Admin access checks
- Redirects

### Supabase Client Logs
- Client initialization
- Missing environment variables
- Connection errors

### Admin Operations
- Admin verification attempts
- Failed admin checks
- Service role key status

### Errors
- All errors are logged (even in production)
- Look for `[CMS Error]` prefix

## 🛠️ Enable Debug Logging

To see even more detailed logs, set `DEBUG=true` in `.env.local`:

```env
DEBUG=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Then restart the dev server.

## 📝 Log Levels

- **Error**: Always logged (production + development)
- **Warn**: Development only
- **Info**: Development only
- **Debug**: Development + `DEBUG=true` only

## 🔧 Using the Logger Utility

You can use the logger in your code:

```typescript
import { logger } from '@/lib/utils/logger'

// Log info
logger.log('User logged in', userId)

// Log error
logger.error('Failed to save', error)

// Log warning
logger.warn('Missing optional field')

// Debug (only with DEBUG=true)
logger.debug('Detailed debug info')
```

## 🐛 Troubleshooting

### No Logs Showing?

1. **Check you're in development mode**:
   - Logs only show in `NODE_ENV=development`
   - Production builds minimize logs

2. **Check terminal output**:
   - Make sure you're running `npm run dev`
   - Check the terminal where you started the server

3. **Check browser console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for `[CMS]` prefixed messages

4. **Check Vercel logs**:
   - Go to Vercel dashboard
   - Check Function Logs for server-side logs

### Logs Too Verbose?

Logs are automatically filtered:
- Only errors show in production
- Info/warn/debug only in development
- Use `DEBUG=true` for extra detail

## 📋 Common Log Messages

### Middleware
```
[Middleware] GET /add-content
[Middleware] Checking admin access for user: xxx
[Middleware] Admin access granted
```

### Supabase
```
[Supabase Server] Creating client...
[Supabase Admin] Admin client initialized successfully
```

### Errors
```
[Middleware] Missing NEXT_PUBLIC_SUPABASE_URL
[CMS Error] Failed to fetch data: ...
[Supabase Admin] Admin verification failed: ...
```

## ✅ Next Steps

1. **Run dev server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Open DevTools**: Press F12
4. **Check Console tab**: See client-side logs
5. **Check Terminal**: See server-side logs

Logs should now be visible! 🎉

