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

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for Vercel
- **[CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md)** - How CMS connects to website
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick 5-minute deploy guide
- **[SETUP_GITHUB.md](./SETUP_GITHUB.md)** - GitHub repository setup

## 🔗 How It Works

This CMS connects to the same Supabase database as your website:

```
CMS (cms.qoupl.ai)  ──┐
                      ├──>  Supabase Database  <──  Website (qoupl.ai)
                      └──>  (Shared database)
```

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
│   └── supabase/       # Supabase clients
└── middleware.ts        # Route protection
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

Quick version:
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

## 📝 License

Proprietary - qoupl.ai
