# How CMS Connects to Website

## Architecture Overview

Both your **CMS** and **Website** connect to the **same Supabase database**. They are completely independent applications that share data.

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                        │
│  (Single Source of Truth)                                   │
│                                                              │
│  Tables:                                                    │
│  - blog_posts                                               │
│  - faqs                                                      │
│  - features                                                  │
│  - pricing_plans                                            │
│  - pages                                                     │
│  - sections                                                  │
│  - media                                                     │
│  - admin_users                                               │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               │                              │
    ┌──────────▼──────────┐      ┌──────────▼──────────┐
    │   CMS Repo           │      │   Website Repo        │
    │   (qoupl-cms)        │      │   (qoupl-website)    │
    │                      │      │                      │
    │  Deployed to:        │      │  Deployed to:        │
    │  cms.qoupl.ai        │      │  qoupl.ai            │
    │                      │      │                      │
    │  [WRITE ACCESS]      │      │  [READ ACCESS]       │
    │                      │      │                      │
    │  Uses:                │      │  Uses:               │
    │  - Service Role Key   │      │  - Anon Key          │
    │  - Bypasses RLS       │      │  - Respects RLS      │
    │                      │      │                      │
    │  Can:                 │      │  Can:                │
    │  - Create content     │      │  - Read published    │
    │  - Update content     │      │    content only     │
    │  - Delete content     │      │  - Display content   │
    │  - Upload media       │      │  - Show images       │
    └──────────────────────┘      └──────────────────────┘
```

## How It Works

### 1. CMS Writes Data

When you create/edit content in the CMS:

```typescript
// CMS uses admin client (lib/supabase/admin.ts)
const adminClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY  // ← Admin key
)

// Can write to database
await adminClient.from('blog_posts').insert({ ... })
```

**Key Points:**
- Uses `SUPABASE_SERVICE_ROLE_KEY` (admin key)
- Bypasses Row Level Security (RLS)
- Can perform any database operation
- Only used in server-side code (Server Actions)

### 2. Website Reads Data

When visitors view your website:

```typescript
// Website uses regular client (lib/supabase/server.ts)
const supabase = await createClient()  // Uses anon key

// Can only read published content
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('published', true)  // ← Only published posts
```

**Key Points:**
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public key)
- Respects Row Level Security (RLS)
- Can only read data allowed by RLS policies
- Automatically filters by `published = true`

### 3. Real-Time Connection

```
CMS Action                    Database                    Website Display
─────────────────────────────────────────────────────────────────────
1. Admin creates blog post
   ↓
2. CMS saves to Supabase
   ↓
3. Database updated
   ↓
4. Website fetches from Supabase
   ↓
5. Content appears on website
   (instantly, no delay)
```

**No API calls needed!** Both apps connect directly to Supabase.

## Environment Variables

### CMS (Vercel Project: `qoupl-website-cms`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Website (Vercel Project: `qoupl-website`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  ← Same URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← Same key
# No SUPABASE_SERVICE_ROLE_KEY needed
```

**Important:** Both use the **same** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` because they connect to the same Supabase project.

## Deployment Flow

### Step 1: Deploy CMS

1. Push CMS code to GitHub: `qoupl-ai/qoupl-website-cms`
2. Deploy to Vercel
3. Set environment variables (including `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy to `cms.qoupl.ai`

### Step 2: Website Already Deployed

Your website is already deployed and reading from Supabase. No changes needed!

### Step 3: Test Connection

1. Login to CMS at `cms.qoupl.ai`
2. Create a blog post
3. Visit `qoupl.ai/blog`
4. See the new post appear immediately

## Security Model

### CMS Security

- **Authentication**: Supabase Auth (login required)
- **Authorization**: `admin_users` table check
- **Database Access**: Service role key (full access)
- **Middleware**: Protects all routes except `/login`

### Website Security

- **Authentication**: None (public site)
- **Authorization**: RLS policies in Supabase
- **Database Access**: Anon key (read-only, filtered)
- **Middleware**: No protection (public routes)

### Row Level Security (RLS)

Your Supabase database has RLS policies that:

1. **Allow public reads** for published content:
   ```sql
   -- Example: Blog posts
   CREATE POLICY "Public can read published posts"
   ON blog_posts FOR SELECT
   USING (published = true);
   ```

2. **Block public writes**:
   ```sql
   -- Only admins (via service role) can write
   -- No public write policy exists
   ```

## Data Flow Examples

### Example 1: Creating a Blog Post

```
1. Admin logs into CMS (cms.qoupl.ai)
   ↓
2. Fills out blog post form
   ↓
3. Clicks "Create"
   ↓
4. CMS Server Action runs:
   - Uses admin client
   - Inserts into blog_posts table
   - Sets published = true
   ↓
5. Database updated
   ↓
6. Website page (qoupl.ai/blog) fetches:
   - Uses anon client
   - Queries blog_posts WHERE published = true
   - Gets new post
   ↓
7. New post appears on website
```

### Example 2: Uploading an Image

```
1. Admin uploads image in CMS
   ↓
2. CMS uploads to Supabase Storage
   - Uses admin client
   - Saves to bucket (e.g., "blog-images")
   ↓
3. CMS saves metadata to media table
   ↓
4. Website fetches image:
   - Uses public URL from Supabase Storage
   - No authentication needed (public bucket)
   ↓
5. Image displays on website
```

## Troubleshooting Connection Issues

### Problem: Content created in CMS doesn't appear on website

**Solutions:**
1. Check RLS policies allow public reads
2. Verify content is marked as `published = true`
3. Check website environment variables match CMS
4. Verify both use same Supabase project URL

### Problem: Can't login to CMS

**Solutions:**
1. Verify admin user exists in `admin_users` table
2. Check `is_active = true` in database
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
4. Check Supabase credentials are correct

### Problem: Images not loading

**Solutions:**
1. Verify storage buckets exist in Supabase
2. Check bucket policies are public
3. Verify image paths in database are correct
4. Check `NEXT_PUBLIC_SUPABASE_URL` is set correctly

## Monitoring

### Check Connection Status

1. **CMS**: Visit `cms.qoupl.ai` → Should show login or dashboard
2. **Website**: Visit `qoupl.ai` → Should load normally
3. **Database**: Check Supabase dashboard → See data in tables

### Verify Data Flow

1. Create test content in CMS
2. Check Supabase dashboard → See new row in table
3. Visit website → See new content appear
4. If content doesn't appear → Check RLS policies

## Summary

✅ **CMS and Website are independent apps**
✅ **Both connect to same Supabase database**
✅ **CMS writes, Website reads**
✅ **No API layer needed**
✅ **Changes appear instantly**
✅ **Secure with RLS policies**

Your CMS is now ready to deploy and will automatically connect to your existing website through the shared Supabase database!

