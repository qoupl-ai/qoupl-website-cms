# Complete Setup Guide - CMS to Website Connection

## 🎯 What You Need to Do (In Order)

### Step 1: Create GitHub Repository ⚠️ REQUIRED FIRST

The repository doesn't exist yet. You need to create it:

1. **Go to GitHub**: https://github.com/qoupl-ai
2. **Click "+"** (top right) → **"New repository"**
3. **Repository name**: `qoupl-website-cms`
4. **Set to Private** (recommended)
5. **DO NOT** initialize with any files
6. **Click "Create repository"**

### Step 2: Push Code to GitHub

After creating the repository, run:

```bash
cd /Users/int/Documents/GitHub/qoupl-website/qoupl-cms
git push -u origin main
```

If authentication is needed:
- Use GitHub CLI: `gh auth login`
- Or use SSH (see PUSH_TO_GITHUB.md)

### Step 3: Deploy CMS to Vercel

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**: Click "Add New..." → "Project"
3. **Select**: `qoupl-ai/qoupl-website-cms`
4. **Set Environment Variables** (CRITICAL!):

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   **Important:**
   - Use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` as your website
   - Use the **SAME** `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
   - Add `SUPABASE_SERVICE_ROLE_KEY` (only in CMS)

5. **Deploy**: Click "Deploy"
6. **Add Domain**: `cms.qoupl.ai` (optional)

### Step 4: Verify Connection

1. **Visit CMS**: Your Vercel URL or `cms.qoupl.ai`
2. **Login** with admin credentials
3. **Create test content** (blog post, FAQ, etc.)
4. **Visit website**: `qoupl.ai`
5. **See content appear!** ✅

## 🔗 How Connection Works

**They're already connected!** Both use the same Supabase database:

```
CMS (cms.qoupl.ai)  ──┐
                      ├──>  Supabase Database  <──  Website (qoupl.ai)
                      └──>  (Same database)
```

**What happens:**
1. You create content in CMS → Saves to Supabase
2. Website reads from Supabase → Shows content instantly
3. **No API needed!** Direct database connection

## ✅ Checklist

- [ ] Create GitHub repository `qoupl-website-cms`
- [ ] Push code to GitHub
- [ ] Deploy CMS to Vercel
- [ ] Set environment variables in Vercel
- [ ] Test CMS login
- [ ] Create test content
- [ ] Verify content appears on website

## 🎉 That's It!

Once you deploy CMS to Vercel with the correct environment variables, it will automatically connect to your website through the shared Supabase database!

**No additional configuration needed!**

