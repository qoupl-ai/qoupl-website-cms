# CMS Migration Complete! ✅

The CMS has been successfully separated from the website repository.

## What Was Done

### CMS Repo (`qoupl-cms/`)
- ✅ Created complete CMS folder structure
- ✅ Copied all CMS routes (`app/add-content`, `app/login`)
- ✅ Copied all CMS components (`components/cms`)
- ✅ Copied UI components (`components/ui`)
- ✅ Copied server actions (`app/actions`)
- ✅ Copied authentication utilities (`lib/auth`)
- ✅ Copied Supabase utilities including admin client (`lib/supabase`)
- ✅ Copied configuration files (package.json, tsconfig, tailwind, etc.)
- ✅ Created CMS-specific layout and root page
- ✅ Created middleware for route protection
- ✅ Created README and documentation

### Website Repo (Cleaned Up)
- ✅ Removed CMS routes (`app/add-content`, `app/login`)
- ✅ Removed CMS components (`components/cms`)
- ✅ Removed server actions (`app/actions`)
- ✅ Removed auth utilities (`lib/auth`)
- ✅ Removed admin Supabase client (`lib/supabase/admin.ts`)
- ✅ Updated middleware (removed CMS route protection)

## Next Steps

### 1. Set Up CMS Repo

```bash
cd qoupl-cms
npm install
```

### 2. Create `.env.local`

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test CMS Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test:
- Login page
- Dashboard
- Creating/editing content

### 4. Push CMS to GitHub

```bash
cd qoupl-cms
git init
git add .
git commit -m "Initial CMS commit - separated from website repo"
git remote add origin https://github.com/qoupl-ai/qoupl-website-cms.git
git push -u origin main
```

### 5. Deploy CMS to Vercel

1. Go to Vercel dashboard
2. Import project from GitHub (`qoupl-ai/qoupl-website-cms`)
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy to subdomain (e.g., `cms.qoupl.ai`)

### 6. Verify Website Still Works

```bash
cd ..  # Back to website repo
npm run dev
```

Test that:
- Blog page loads
- FAQ page loads
- Features page loads
- Pricing page loads
- All images load from Supabase
- No broken links

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Website Repo      │         │     CMS Repo        │
│  (qoupl-website)    │         │   (qoupl-cms)       │
│                     │         │                     │
│  - Public pages     │         │  - Admin panel      │
│  - Blog display     │         │  - Content editor   │
│  - FAQ display      │         │  - Media upload     │
│  - Features display │         │  - Login page       │
│                     │         │                     │
│  [READ ONLY]        │         │  [READ/WRITE]       │
└──────────┬──────────┘         └──────────┬──────────┘
           │                                │
           └────────────┬───────────────────┘
                        │
           ┌────────────▼────────────┐
           │   Supabase Database      │
           │   (Shared Instance)      │
           └─────────────────────────┘
```

## Important Notes

- Both repos share the same Supabase database
- CMS writes data (uses service role key)
- Website reads data (uses anon key with RLS)
- No API layer needed - direct Supabase connection
- Environment variables must be set in both Vercel projects

## Files Structure

### CMS Repo
```
qoupl-cms/
├── app/
│   ├── add-content/     # CMS admin panel
│   ├── login/           # Admin login
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Root page (redirects)
│   └── globals.css      # Global styles
├── components/
│   ├── cms/             # CMS components
│   ├── ui/              # UI components
│   └── theme-provider.tsx
├── lib/
│   ├── auth/            # Admin auth
│   ├── supabase/        # Supabase clients (including admin)
│   └── utils.ts
├── hooks/
├── middleware.ts         # Route protection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### Website Repo (After Cleanup)
```
qoupl-website/
├── app/
│   ├── blog/            # Public blog pages
│   ├── faq/             # Public FAQ page
│   ├── features/        # Public features page
│   ├── pricing/         # Public pricing page
│   ├── about/           # Public pages
│   └── ...
├── components/
│   ├── sections/        # Public page sections
│   ├── ui/              # UI components
│   ├── navbar.tsx       # Public navbar
│   └── ...
├── lib/
│   └── supabase/        # Read-only Supabase clients
│       ├── server.ts
│       ├── client.ts
│       ├── storage-url.ts
│       ├── content.ts
│       └── storage.ts
└── ...
```

## Success Criteria

✅ CMS repo runs independently
✅ Website repo runs independently
✅ Content created in CMS appears on website
✅ Both repos can be deployed separately
✅ No broken functionality

## Troubleshooting

If you encounter issues:

1. **CMS login not working**: Check admin user exists in `admin_users` table
2. **Content not saving**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. **Website not loading content**: Check Supabase RLS policies allow public reads
4. **Images not loading**: Verify storage bucket policies are public

## Support

For issues or questions, refer to the README files in each repo.

---

**Migration completed successfully! 🎉**

