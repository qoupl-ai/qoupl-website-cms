# Quick Deploy Guide

## 🚀 Push to GitHub (Already Done!)

The code has been committed and is ready to push. If you haven't pushed yet, run:

```bash
cd qoupl-cms
git push -u origin main
```

## 📦 Deploy to Vercel (5 Minutes)

### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose **`qoupl-ai/qoupl-website-cms`**
5. Click **"Import"**

### Step 2: Configure Project

- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add these **3 variables**:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these:**
- Go to your Supabase project dashboard
- Settings → API
- Copy the values

**Important:** Use the **same** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Your CMS is live!

### Step 5: Add Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add domain: `cms.qoupl.ai` (or `admin.qoupl.ai`)
3. Follow DNS instructions

## 🔗 How It Connects to Your Website

**Simple Answer:** Both CMS and Website connect to the **same Supabase database**.

```
CMS (cms.qoupl.ai)  ──┐
                      ├──>  Supabase Database  <──  Website (qoupl.ai)
                      └──>  (Same database)
```

**What happens:**
1. You create content in CMS → Saves to Supabase
2. Website reads from Supabase → Shows content instantly
3. **No API needed!** Direct database connection

## ✅ Test After Deployment

1. **Visit CMS**: `https://your-cms-url.vercel.app` or `cms.qoupl.ai`
2. **Login** with your admin credentials
3. **Create a test blog post**
4. **Visit your website**: `qoupl.ai/blog`
5. **See the new post appear!** ✨

## 🎯 That's It!

Your CMS is now:
- ✅ Pushed to GitHub
- ✅ Ready to deploy on Vercel
- ✅ Connected to your website via Supabase
- ✅ Fully functional

**Next:** Deploy on Vercel using the steps above!

