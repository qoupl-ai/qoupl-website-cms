# How to See Logs When Running CMS Locally

## 🚀 Quick Fix

I've updated all logging to **ALWAYS show** (not just in development). You should now see logs immediately!

## 📍 Where to See Logs

### 1. Terminal (Server-Side Logs)

When you run:
```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm run dev
```

**You should immediately see:**
```
============================================================
🚀 [CMS] Server starting...
📦 [CMS] NODE_ENV: development
🔗 [CMS] Supabase URL: ✅ Set
🔑 [CMS] Supabase Anon Key: ✅ Set
🔐 [CMS] Service Role Key: ✅ Set
📁 [CMS] Working directory: /Users/int/Documents/GitHub/qoupl-website-cms
============================================================
```

### 2. As You Navigate

When you visit pages, you'll see:
```
🔒 [Middleware] GET /add-content
🔍 [Middleware] Checking admin access for user: xxx
✅ [Middleware] Admin access granted for: user@example.com
📄 [CMS Layout] Rendering CMS layout
👤 [CMS Layout] User found: xxx user@example.com
✅ [CMS Layout] Admin user confirmed: user@example.com
📊 [CMS Dashboard] Loading dashboard
📈 [CMS Dashboard] Fetching content counts
```

### 3. Browser Console (Client-Side)

1. Open browser: http://localhost:3000
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. You'll see client-side logs there

## 🔧 If You Still Don't See Logs

### Check 1: Is Dev Server Running?

Make sure you see:
```
> next dev
> ready - started server on 0.0.0.0:3000
```

### Check 2: Restart Dev Server

Sometimes you need to restart:
```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

### Check 3: Check Terminal Output

Look at the **terminal where you ran `npm run dev`** - logs appear there, not in a separate window.

### Check 4: Environment Variables

Make sure `.env.local` exists:
```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
ls -la .env.local
```

If missing, create it:
```bash
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
EOF
```

### Check 5: Pull Latest Code

Make sure you have the latest logging updates:
```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
git pull
npm run dev
```

## 📋 What Logs You Should See

### On Server Start:
```
============================================================
🚀 [CMS] Server starting...
📦 [CMS] NODE_ENV: development
🔗 [CMS] Supabase URL: ✅ Set
🔑 [CMS] Supabase Anon Key: ✅ Set
🔐 [CMS] Service Role Key: ✅ Set
📁 [CMS] Working directory: /path/to/cms
============================================================
```

### When Visiting Pages:
```
🔒 [Middleware] GET /add-content
🔍 [Middleware] Checking admin access for user: xxx
✅ [Middleware] Admin access granted for: user@example.com
📄 [CMS Layout] Rendering CMS layout
👤 [CMS Layout] User found: xxx user@example.com
✅ [CMS Layout] Admin user confirmed: user@example.com
📊 [CMS Dashboard] Loading dashboard
```

### If There Are Errors:
```
❌ [Middleware] Missing NEXT_PUBLIC_SUPABASE_URL
❌ [CMS Layout] Auth error: ...
⚠️ [Middleware] User is not an admin, redirecting
```

## ✅ Test It Now

1. **Stop dev server** (if running): Ctrl+C
2. **Restart**:
   ```bash
   cd /Users/int/Documents/GitHub/qoupl-website-cms
   npm run dev
   ```
3. **Look at terminal** - You should see startup logs immediately!
4. **Visit** http://localhost:3000
5. **Check terminal** - See navigation logs
6. **Check browser console** (F12) - See client-side logs

## 🎯 Summary

- ✅ Logs now **ALWAYS show** (not just in development)
- ✅ Logs appear in **terminal** (where you run `npm run dev`)
- ✅ Logs also appear in **browser console** (F12)
- ✅ Emojis make logs easy to spot

**If you still don't see logs, check the terminal where you ran `npm run dev`!**

