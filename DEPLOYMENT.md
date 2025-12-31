# CMS Deployment Guide

## How CMS Connects to Website

Both the CMS and website connect to the **same Supabase database**. Here's how it works:

```
┌─────────────────────┐         ┌─────────────────────┐
│   Website Repo      │         │     CMS Repo        │
│  (qoupl-website)    │         │ (qoupl-website-cms) │
│                     │         │                     │
│  Deployed to:       │         │  Deployed to:       │
│  qoupl.ai           │         │  cms.qoupl.ai       │
│                     │         │                     │
│  - Public pages     │         │  - Admin panel     │
│  - Blog display     │         │  - Content editor   │
│  - FAQ display      │         │  - Media upload     │
│  - Features display │         │  - Login page       │
│                     │         │                     │
│  [READ ONLY]        │         │  [READ/WRITE]       │
│  Uses: anon key     │         │  Uses: service key  │
└──────────┬──────────┘         └──────────┬──────────┘
           │                                │
           └────────────┬───────────────────┘
                        │
           ┌────────────▼────────────┐
           │   Supabase Database      │
           │   (Shared Instance)      │
           │                          │
           │  - blog_posts            │
           │  - faqs                  │
           │  - features              │
           │  - pricing_plans         │
           │  - pages                 │
           │  - sections              │
           │  - media                 │
           └──────────────────────────┘
```

### Connection Flow

1. **CMS writes data** → Uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
2. **Website reads data** → Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respects RLS)
3. **Both use same database** → Content created in CMS appears on website instantly
4. **No API needed** → Direct Supabase connection from both apps

## Vercel Deployment Steps

### Step 1: Push CMS to GitHub

```bash
cd qoupl-cms
git add .
git commit -m "Initial CMS commit - separated from website"
git branch -M main
git remote add origin https://github.com/qoupl-ai/qoupl-website-cms.git
git push -u origin main
```

### Step 2: Deploy CMS to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import GitHub Repository**
   - Select `qoupl-ai/qoupl-website-cms`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Set Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   
   ⚠️ **Important**: 
   - Use the **same** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as your website
   - `SUPABASE_SERVICE_ROLE_KEY` is only needed in CMS (not in website)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Configure Domain**
   - Go to Project Settings → Domains
   - Add custom domain: `cms.qoupl.ai` (or `admin.qoupl.ai`)
   - Follow DNS configuration instructions

### Step 3: Verify Deployment

1. **Test CMS**
   - Visit `https://cms.qoupl.ai` (or your custom domain)
   - Should redirect to `/add-content` or show login page
   - Login with admin credentials
   - Test creating/editing content

2. **Test Website Connection**
   - Visit your website: `https://qoupl.ai`
   - Create content in CMS
   - Verify it appears on website immediately

## Environment Variables Reference

### CMS Repo (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Website Repo (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# No SUPABASE_SERVICE_ROLE_KEY needed
```

## How It Works

### CMS Operations (Write)
- Uses `SUPABASE_SERVICE_ROLE_KEY` for admin operations
- Can create, update, delete content
- Bypasses Row Level Security (RLS)
- All operations go through `lib/supabase/admin.ts`

### Website Operations (Read)
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` for public reads
- Respects Row Level Security (RLS)
- Can only read published content
- All operations go through `lib/supabase/server.ts` or `client.ts`

### Real-time Updates
- When CMS creates/updates content → Saved to Supabase
- Website fetches from Supabase → Shows updated content
- No webhooks or API calls needed
- Changes appear immediately (Next.js revalidation)

## Troubleshooting

### CMS Not Loading
- Check environment variables in Vercel
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Vercel build logs for errors

### Can't Login to CMS
- Verify admin user exists in `admin_users` table
- Check `is_active = true` in database
- Verify Supabase credentials are correct

### Content Not Appearing on Website
- Check RLS policies allow public reads
- Verify content is marked as `published = true`
- Check website environment variables
- Verify both repos use same Supabase project

### Images Not Loading
- Verify storage buckets exist in Supabase
- Check bucket policies are public
- Verify image paths in database are correct

## Security Notes

1. **Service Role Key**
   - ⚠️ **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client-side
   - Only use in server-side code (Server Actions, API routes)
   - Keep it secret in environment variables

2. **RLS Policies**
   - Website uses anon key with RLS
   - CMS uses service key (bypasses RLS)
   - Ensure RLS policies allow public reads for published content

3. **Admin Access**
   - Only users in `admin_users` table can access CMS
   - Middleware verifies admin status on every request
   - Admin users must have `is_active = true`

## Monitoring

### Vercel Analytics
- Monitor CMS usage in Vercel dashboard
- Check for build errors
- Monitor deployment status

### Supabase Dashboard
- Monitor database queries
- Check storage usage
- Review RLS policies

## Next Steps After Deployment

1. ✅ Test CMS login
2. ✅ Create test content
3. ✅ Verify content appears on website
4. ✅ Test all CMS features (blog, FAQ, features, pricing)
5. ✅ Test media upload
6. ✅ Verify content history works
7. ✅ Set up monitoring/alerts

---

**Your CMS is now deployed and connected to your website! 🎉**

