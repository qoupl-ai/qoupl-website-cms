# How to Connect CMS to Your Website

## ✅ Step 1: Push to GitHub (I'll do this for you)

The code is ready to push. If the repository doesn't exist yet, you'll need to create it first on GitHub.

## 🔗 Step 2: How They Connect

**Good News:** They're already connected! Both CMS and Website use the **same Supabase database**.

```
┌─────────────────┐         ┌─────────────────┐
│   CMS Repo      │         │  Website Repo   │
│  (cms.qoupl.ai) │         │  (qoupl.ai)     │
│                 │         │                 │
│  [WRITE]        │         │  [READ]         │
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

## 📋 Step 3: What You Need to Do

### A. Deploy CMS to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select: `qoupl-ai/qoupl-website-cms`
   - Click "Import"

3. **Set Environment Variables** (CRITICAL!)

   Click "Environment Variables" and add these **3 variables**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

   **Where to find these:**
   - Go to your Supabase project dashboard
   - Settings → API
   - Copy the values

   **IMPORTANT:**
   - Use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` as your website
   - Use the **SAME** `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
   - Add `SUPABASE_SERVICE_ROLE_KEY` (only needed in CMS)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Add Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add: `cms.qoupl.ai` or `admin.qoupl.ai`

### B. Verify Website Environment Variables

Make sure your **website** (already deployed) has these set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

(These should already be set from before)

## ✅ Step 4: Test the Connection

1. **Visit CMS**: `https://your-cms.vercel.app` or `cms.qoupl.ai`
2. **Login** with your admin credentials
3. **Create a test blog post**:
   - Go to Blog section
   - Click "Create Blog Post"
   - Fill in title, content, etc.
   - Set "Published" to ON
   - Click "Create"
4. **Visit your website**: `qoupl.ai/blog`
5. **See the new post appear!** ✨

If the post appears, **connection is working!**

## 🔍 How It Works

### When You Create Content in CMS:

```
1. You create blog post in CMS
   ↓
2. CMS saves to Supabase database
   (using service role key - full access)
   ↓
3. Database updated instantly
   ↓
4. Website fetches from Supabase
   (using anon key - read-only, respects RLS)
   ↓
5. Content appears on website
   (no delay, no API calls needed)
```

### The Magic:

- **CMS writes** → Uses `SUPABASE_SERVICE_ROLE_KEY` (admin access)
- **Website reads** → Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public access)
- **Same database** → Both connect to the same Supabase project
- **No API needed** → Direct database connection
- **Instant updates** → Changes appear immediately

## 🛠️ Troubleshooting

### Problem: Content created in CMS doesn't appear on website

**Solutions:**
1. ✅ Check both repos use **same** `NEXT_PUBLIC_SUPABASE_URL`
2. ✅ Verify content is marked as `published = true`
3. ✅ Check Supabase RLS policies allow public reads
4. ✅ Verify website environment variables are set

### Problem: Can't login to CMS

**Solutions:**
1. ✅ Verify admin user exists in `admin_users` table
2. ✅ Check `is_active = true` in database
3. ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
4. ✅ Check Supabase credentials are correct

### Problem: Images not loading

**Solutions:**
1. ✅ Verify storage buckets exist in Supabase
2. ✅ Check bucket policies are public
3. ✅ Verify image paths in database are correct

## 📊 Verify Connection Status

### Check 1: Supabase Dashboard
- Go to your Supabase project
- Check tables: `blog_posts`, `faqs`, `features`, etc.
- Create content in CMS → See it appear in database

### Check 2: CMS Dashboard
- Login to CMS
- Create content
- Verify it saves successfully

### Check 3: Website
- Visit your website
- Check blog, FAQ, features pages
- See content from database

## 🎯 Summary

**To connect CMS to website:**

1. ✅ Deploy CMS to Vercel (with environment variables)
2. ✅ Ensure website has Supabase environment variables set
3. ✅ Both use same Supabase database
4. ✅ That's it! They're connected!

**No additional configuration needed!** The connection happens automatically through the shared Supabase database.

---

**After deploying CMS to Vercel, it will automatically connect to your website! 🚀**

