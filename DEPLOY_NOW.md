# 🚀 Deploy CMS to Vercel - Step by Step

## ✅ Repo is Now Public!

Now you can deploy to Vercel's free plan.

## 📋 Deployment Steps

### Step 1: Import to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Repository**
   - You should now see: `qoupl-ai/qoupl-website-cms`
   - Click **"Import"** next to it

### Step 2: Configure Project

- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 3: Set Environment Variables ⚠️ CRITICAL!

Before deploying, click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

**Important:**
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` as your website
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
- `SUPABASE_SERVICE_ROLE_KEY` is only needed in CMS

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Your CMS is live!

### Step 5: Add Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add: `cms.qoupl.ai` or `admin.qoupl.ai`
3. Follow DNS configuration instructions

## ✅ Test After Deployment

1. **Visit CMS**: Your Vercel URL (e.g., `qoupl-cms.vercel.app`)
2. **Login** with admin credentials
3. **Create test content** (blog post, FAQ, etc.)
4. **Visit website**: `qoupl.ai`
5. **See content appear!** ✨

## 🔗 Connection Status

Once deployed, your CMS will automatically connect to your website through the shared Supabase database!

**No additional configuration needed!**

---

**Ready to deploy! 🚀**

