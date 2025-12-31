# Verify CMS Setup - Pre-Deployment Checklist

## ✅ File Structure Check

Run these commands to verify everything is in place:

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms

# Check core files
test -f package.json && echo "✓ package.json" || echo "✗ package.json missing"
test -f next.config.js && echo "✓ next.config.js" || echo "✗ next.config.js missing"
test -f tsconfig.json && echo "✓ tsconfig.json" || echo "✗ tsconfig.json missing"
test -f middleware.ts && echo "✓ middleware.ts" || echo "✗ middleware.ts missing"
test -f app/layout.tsx && echo "✓ app/layout.tsx" || echo "✗ app/layout.tsx missing"
test -f app/page.tsx && echo "✓ app/page.tsx" || echo "✗ app/page.tsx missing"

# Check CMS directories
test -d app/add-content && echo "✓ app/add-content" || echo "✗ app/add-content missing"
test -d app/login && echo "✓ app/login" || echo "✗ app/login missing"
test -d components/cms && echo "✓ components/cms" || echo "✗ components/cms missing"
test -d components/ui && echo "✓ components/ui" || echo "✗ components/ui missing"
test -d lib/auth && echo "✓ lib/auth" || echo "✗ lib/auth missing"
test -d lib/supabase && echo "✓ lib/supabase" || echo "✗ lib/supabase missing"
test -d app/actions && echo "✓ app/actions" || echo "✗ app/actions missing"
```

## 📋 Required Files Checklist

### Configuration Files
- [x] `package.json` - Dependencies and scripts
- [x] `next.config.js` - Next.js configuration
- [x] `tsconfig.json` - TypeScript configuration
- [x] `tailwind.config.ts` - Tailwind CSS configuration
- [x] `postcss.config.mjs` - PostCSS configuration
- [x] `components.json` - shadcn/ui configuration
- [x] `eslint.config.mjs` - ESLint configuration
- [x] `.gitignore` - Git ignore rules
- [x] `middleware.ts` - Route protection

### Application Files
- [x] `app/layout.tsx` - Root layout with logging
- [x] `app/page.tsx` - Root page (redirects to /add-content)
- [x] `app/globals.css` - Global styles
- [x] `app/add-content/` - CMS admin panel routes
- [x] `app/login/` - Admin login page
- [x] `app/actions/` - Server actions

### Components
- [x] `components/cms/` - CMS-specific components
- [x] `components/ui/` - UI components (shadcn)
- [x] `components/theme-provider.tsx` - Theme provider

### Libraries
- [x] `lib/auth/` - Admin authentication
- [x] `lib/supabase/` - Supabase clients (including admin.ts)
- [x] `lib/utils.ts` - Utility functions
- [x] `lib/utils/logger.ts` - Logging utility

### Hooks
- [x] `hooks/use-toast.ts` - Toast hook

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
cd /Users/int/Documents/GitHub/qoupl-website-cms
npm install
```

### 2. Create Environment File

```bash
cp .env.local.example .env.local
# Then edit .env.local and add your Supabase credentials
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000

You should see:
- Startup logs in terminal
- Login page or redirect to /add-content
- No errors in console

### 4. Build Test

```bash
npm run build
```

Should complete without errors.

### 5. Deploy to Vercel

1. Push to GitHub (already done)
2. Import to Vercel
3. Set environment variables
4. Deploy

## ✅ Pre-Deployment Verification

Before deploying, verify:

- [ ] All files listed above exist
- [ ] `npm install` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Environment variables are set
- [ ] Can login to CMS locally
- [ ] Can create/edit content locally
- [ ] Logs appear in terminal and browser console

## 🚀 Ready to Deploy!

If all checks pass, your CMS is ready to deploy to Vercel!

