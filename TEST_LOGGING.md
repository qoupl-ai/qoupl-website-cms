# Test Logging - Quick Guide

## ✅ Logging Has Been Added

I've added comprehensive logging throughout the CMS. Here's how to see them:

## 🔍 Where Logs Appear

### 1. Terminal (Server-Side Logs)

When you run `npm run dev`, you'll see logs in your terminal:

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm run dev
```

**Look for:**
- `[CMS]` - General CMS logs
- `[Middleware]` - Route protection logs
- `[CMS Layout]` - Layout rendering logs
- `[CMS Dashboard]` - Dashboard loading logs
- `[Supabase Server]` - Database connection logs
- `[Supabase Admin]` - Admin operations logs

### 2. Browser Console (Client-Side Logs)

1. Open your browser
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Visit your CMS: http://localhost:3000

**You should see logs like:**
```
[CMS] Server starting...
[Middleware] GET /add-content
[CMS Layout] Rendering CMS layout
```

## 🧪 Test It Now

### Step 1: Make Sure Dev Server is Running

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm run dev
```

### Step 2: Check Terminal Output

You should immediately see:
```
==================================================
[CMS] Server starting...
[CMS] NODE_ENV: development
[CMS] Supabase URL: Set ✓
[CMS] Supabase Anon Key: Set ✓
[CMS] Service Role Key: Set ✓
==================================================
```

### Step 3: Visit CMS in Browser

1. Open: http://localhost:3000
2. Open Browser DevTools (F12)
3. Go to Console tab
4. You should see logs as pages load

### Step 4: Check What Happens

When you visit different pages, you'll see:
- `[Middleware] GET /login` - When visiting login
- `[CMS Layout] Rendering CMS layout` - When loading CMS pages
- `[CMS Dashboard] Loading dashboard` - When loading dashboard

## 🐛 If You Still Don't See Logs

### Check 1: Is Dev Server Running?

```bash
# Make sure you see this:
> next dev
> ready - started server on 0.0.0.0:3000
```

### Check 2: Environment Variables

Make sure `.env.local` exists:
```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
ls -la .env.local
```

### Check 3: Restart Dev Server

Sometimes you need to restart:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Check 4: Check Browser Console

- Open DevTools (F12)
- Go to Console tab
- Make sure "All levels" is selected (not just Errors)

### Check 5: Pull Latest Code

Make sure you have the latest code with logging:
```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
git pull
npm install
npm run dev
```

## 📋 What You Should See

### On Server Start:
```
==================================================
[CMS] Server starting...
[CMS] NODE_ENV: development
[CMS] Supabase URL: Set ✓
[CMS] Supabase Anon Key: Set ✓
[CMS] Service Role Key: Set ✓
==================================================
```

### When Visiting Pages:
```
[Middleware] GET /add-content
[CMS Layout] Rendering CMS layout
[CMS Layout] User found: xxx-xxx-xxx user@example.com
[CMS Layout] Admin user confirmed: user@example.com
[CMS Dashboard] Loading dashboard
[CMS Dashboard] Fetching content counts
```

### If There Are Errors:
```
[CMS Error] Failed to fetch data: ...
[Middleware] Missing NEXT_PUBLIC_SUPABASE_URL
[Supabase Admin] Admin verification failed: ...
```

## ✅ Next Steps

1. **Restart dev server**: `npm run dev`
2. **Check terminal**: Look for startup logs
3. **Open browser**: http://localhost:3000
4. **Open DevTools**: F12 → Console tab
5. **Navigate pages**: See logs appear

If you still don't see logs after this, let me know what you see in the terminal!

