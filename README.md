# qoupl CMS

Admin content management system for the qoupl website.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📚 Documentation

- **[VERIFY_SETUP.md](./VERIFY_SETUP.md)** - Pre-deployment checklist
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md)** - How CMS connects to website
- **[LOGGING_GUIDE.md](./LOGGING_GUIDE.md)** - How to see logs
- **[TEST_LOGGING.md](./TEST_LOGGING.md)** - Test logging setup

## 🔗 How It Connects to Website

This CMS connects to the **same Supabase database** as your website:

```
CMS (cms.qoupl.ai)  ──┐
                      ├──>  Supabase Database  <──  Website (qoupl.ai)
                      └──>  (Shared database)
```

**How it works:**
- **CMS writes** data using service role key
- **Website reads** data using anon key
- **No API needed** - direct database connection
- **Changes appear instantly** on website

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Storage**: Supabase Storage

## 📦 Features

- ✅ Blog post management
- ✅ FAQ management
- ✅ Feature management
- ✅ Pricing plan management
- ✅ Page and section editing
- ✅ Media library
- ✅ Content history tracking
- ✅ Admin authentication
- ✅ Comprehensive logging

## 🔒 Security

- Admin-only access via `admin_users` table
- Service role key for database operations
- Row Level Security (RLS) in Supabase
- Protected routes with middleware

## 📖 Project Structure

```
├── app/
│   ├── add-content/     # CMS admin panel
│   ├── login/          # Admin login
│   └── layout.tsx       # Root layout
├── components/
│   ├── cms/            # CMS components
│   └── ui/             # UI components
├── lib/
│   ├── auth/           # Admin authentication
│   ├── supabase/       # Supabase clients
│   └── validation/     # Validation schemas
└── middleware.ts        # Route protection
```

## 🚢 Deployment

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Deploy to Vercel

1. Import project from GitHub
2. Set environment variables
3. Deploy!

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Can login to CMS
- [ ] Can create/edit content
- [ ] Logs appear in terminal and browser console

## 📝 License

Proprietary - qoupl.ai
