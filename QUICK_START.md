# 🚀 Quick Start - Get CMS Running

## Step 1: Install Dependencies

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm install
```

This will install all required packages (takes 1-2 minutes).

## Step 2: Set Up Environment Variables

Create `.env.local` file:

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
nano .env.local
# or use your preferred editor
```

Add these 3 variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

**Important:**
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` as your website
- Use the **SAME** `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
- `SUPABASE_SERVICE_ROLE_KEY` is only needed in CMS

## Step 3: Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

You should see:
- Login page, OR
- Redirect to `/add-content` (if already logged in)

## Step 4: Test Connection

1. **Login** with your admin credentials
2. **Create test content**:
   - Go to Blog section
   - Click "Create Blog Post"
   - Fill in title, content
   - Set "Published" to ON
   - Click "Create"
3. **Check website**: Visit `qoupl.ai/blog`
4. **See the post appear!** ✨

If the post appears, **connection is working!**

## Step 5: Deploy to Vercel

Once local testing works:

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**: Select `qoupl-ai/qoupl-website-cms`
3. **Set Environment Variables** (same 3 variables from `.env.local`)
4. **Deploy**

See `DEPLOYMENT.md` for detailed instructions.

## 🔗 How It Connects to Website

**They're already connected!** Both use the **same Supabase database**:

```
CMS (localhost:3000)  ──┐
                        ├──>  Supabase Database  <──  Website (qoupl.ai)
                        └──>  (Same database)
```

- CMS writes data → Supabase
- Website reads data → Supabase
- **No API needed!** Direct connection
- **Changes appear instantly!**

## ✅ Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` with 3 variables
- [ ] Run dev server (`npm run dev`)
- [ ] Test login
- [ ] Create test content
- [ ] Verify content appears on website
- [ ] Deploy to Vercel

## 🎉 That's It!

After setting up `.env.local` and running `npm run dev`, your CMS will connect to your website through the shared Supabase database!

