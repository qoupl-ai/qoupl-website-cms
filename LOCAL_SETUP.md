# Local Setup Guide

## Step 1: Install Dependencies

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm install
```

## Step 2: Create Environment File

Create `.env.local` in the root directory:

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
touch .env.local
```

Then add these variables to `.env.local`:

```env
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

## Step 3: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

You should see the login page or be redirected to `/add-content`.

## Step 4: Test Locally

1. **Login** with your admin credentials
2. **Test creating content**:
   - Go to Blog section
   - Create a test post
   - Verify it saves
3. **Check website**: Visit `qoupl.ai/blog` and see if the post appears

## Step 5: Deploy to Vercel

Once local testing works, deploy to Vercel:

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**: Select `qoupl-ai/qoupl-website-cms`
3. **Set Environment Variables** (same as `.env.local`)
4. **Deploy**

See `DEPLOYMENT.md` for detailed Vercel deployment instructions.

