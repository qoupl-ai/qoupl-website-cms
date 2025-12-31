# 🚀 START HERE - Complete Setup Instructions

## Step 1: Create GitHub Repository (2 minutes)

**You need to do this first before I can push the code.**

1. **Go to GitHub**: https://github.com/qoupl-ai
2. **Click the "+" icon** (top right corner) → **"New repository"**
3. **Fill in the form**:
   - **Repository name**: `qoupl-website-cms`
   - **Description**: "CMS for qoupl website"
   - **Visibility**: Select **"Private"** (recommended for CMS)
   - **IMPORTANT**: 
     - ❌ DO NOT check "Add a README file"
     - ❌ DO NOT check "Add .gitignore"
     - ❌ DO NOT check "Choose a license"
   - Leave everything else empty
4. **Click "Create repository"**

## Step 2: Push Code to GitHub

After creating the repository, come back here and I'll push the code, OR run:

```bash
cd /Users/int/Documents/GitHub/qoupl-website/qoupl-cms
git push -u origin main
```

If you get authentication errors, you may need to:
- Set up GitHub authentication
- Or use SSH instead of HTTPS

## Step 3: Deploy to Vercel (5 minutes)

### A. Import Project

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import Git Repository**: Select `qoupl-ai/qoupl-website-cms`
4. **Click "Import"**

### B. Configure Project

- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### C. Set Environment Variables ⚠️ CRITICAL!

Click **"Environment Variables"** and add these **3 variables**:

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

**IMPORTANT:**
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` as your website
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
- `SUPABASE_SERVICE_ROLE_KEY` is only needed in CMS (not in website)

### D. Deploy

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. ✅ Your CMS is live!

### E. Add Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add domain: `cms.qoupl.ai` (or `admin.qoupl.ai`)
3. Follow DNS configuration instructions

## Step 4: Test Connection to Website

### Test 1: CMS Login

1. Visit your CMS: `https://your-cms.vercel.app` or `cms.qoupl.ai`
2. You should see the login page
3. Login with your admin credentials

### Test 2: Create Content

1. In CMS, go to **Blog** section
2. Click **"Create Blog Post"**
3. Fill in:
   - Title: "Test Post"
   - Content: "This is a test"
   - Set **"Published"** to **ON**
   - Click **"Create"**

### Test 3: Verify on Website

1. Visit your website: `qoupl.ai/blog`
2. **You should see "Test Post" appear!** ✨

If you see the post, **connection is working!**

## 🔗 How Connection Works

**They're already connected!** Both CMS and Website use the **same Supabase database**:

```
┌─────────────────┐         ┌─────────────────┐
│   CMS Repo      │         │  Website Repo   │
│  (cms.qoupl.ai) │         │  (qoupl.ai)    │
│                 │         │                 │
│  [WRITE]        │         │  [READ]         │
│  Uses: Service  │         │  Uses: Anon    │
│        Role Key │         │        Key      │
└────────┬────────┘         └────────┬───────┘
         │                            │
         └──────────┬─────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Supabase Database  │
         │  (Shared Instance)  │
         │                     │
         │  - blog_posts       │
         │  - faqs             │
         │  - features          │
         │  - pricing_plans     │
         │  - pages             │
         │  - sections          │
         │  - media             │
         └─────────────────────┘
```

**What happens:**
1. You create content in CMS → Saves to Supabase database
2. Website reads from Supabase → Shows content instantly
3. **No API calls needed!** Direct database connection
4. **Changes appear immediately!**

## ✅ Checklist

- [ ] Create GitHub repository `qoupl-website-cms`
- [ ] Push code to GitHub
- [ ] Deploy CMS to Vercel
- [ ] Set 3 environment variables in Vercel
- [ ] Deploy completes successfully
- [ ] Can login to CMS
- [ ] Can create content in CMS
- [ ] Content appears on website

## 🎉 That's It!

Once you:
1. ✅ Create GitHub repo
2. ✅ Push code
3. ✅ Deploy to Vercel with environment variables

**The CMS will automatically connect to your website!**

No additional configuration needed - the connection happens through the shared Supabase database.

---

**After you create the GitHub repository, let me know and I'll push the code!**

