# qoupl CMS

Admin content management system for the qoupl website.

## Overview

This is the CMS (Content Management System) for managing content on the qoupl website. It provides an admin interface for managing blog posts, FAQs, features, pricing plans, pages, sections, media, and global content.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Storage**: Supabase Storage

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with database schema set up

### Installation

1. Clone the repository:
```bash
git clone https://github.com/qoupl-ai/qoupl-website-cms.git
cd qoupl-website-cms
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) | Yes |

## Project Structure

```
├── app/
│   ├── add-content/          # CMS admin panel routes
│   │   ├── blog/             # Blog management
│   │   ├── faqs/             # FAQ management
│   │   ├── features/         # Feature management
│   │   ├── pricing/          # Pricing management
│   │   ├── pages/            # Page management
│   │   ├── media/            # Media library
│   │   ├── history/          # Content history
│   │   └── layout.tsx        # Protected layout
│   ├── login/                # Admin login page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root page (redirects to /add-content)
├── components/
│   ├── cms/                  # CMS-specific components
│   ├── ui/                   # Shared UI components
│   └── theme-provider.tsx     # Theme provider
├── lib/
│   ├── auth/                 # Admin authentication
│   ├── supabase/             # Supabase clients
│   └── utils.ts              # Utilities
├── hooks/                    # React hooks
└── middleware.ts             # Route protection
```

## Features

### Authentication
- Supabase Auth integration
- Admin user verification via `admin_users` table
- Protected routes with middleware

### Content Management
- **Blog Posts**: Create, edit, delete blog posts with categories
- **FAQs**: Manage FAQs with categories and ordering
- **Features**: Manage product features with categories
- **Pricing Plans**: Manage pricing tiers and plans
- **Pages**: Edit page content and sections
- **Media Library**: Upload and manage images
- **Content History**: View all content changes

### Security
- Admin-only access
- Row Level Security (RLS) in Supabase
- Service role key for admin operations
- Session management via middleware

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Recommended Subdomain

Deploy to a subdomain like:
- `cms.qoupl.ai`
- `admin.qoupl.ai`
- `manage.qoupl.ai`

## Database Schema

The CMS connects to the same Supabase database as the website. Key tables:
- `admin_users` - Admin access control
- `blog_posts` - Blog content
- `faqs` - FAQ content
- `features` - Feature content
- `pricing_plans` - Pricing tiers
- `pages` - Page metadata
- `sections` - Page sections
- `media` - Media library
- `content_history` - Audit trail

## Development

### Adding New Content Types

1. Create database table in Supabase
2. Create action file in `app/actions/`
3. Create CMS page in `app/add-content/`
4. Create list/dialog components in `components/cms/`

### Styling

The CMS uses a custom dark theme. CSS variables are defined in `app/globals.css` with `cms-` prefixes.

## Troubleshooting

### Login Issues
- Verify admin user exists in `admin_users` table
- Check `is_active` is `true`
- Verify Supabase credentials

### Content Not Saving
- Check Supabase RLS policies
- Verify service role key is set
- Check browser console for errors

### Images Not Uploading
- Verify storage buckets exist
- Check bucket policies allow uploads
- Verify service role key has storage access

## License

Proprietary - qoupl.ai

