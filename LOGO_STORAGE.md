# Logo Storage Configuration

## ✅ Updated to Use Supabase Storage

All logo references in the CMS now load from Supabase Storage instead of local files.

## 📍 Storage Location

**Bucket**: `brand-assets`  
**Path**: `brand-logo/quoupl.svg`  
**Full URL**: `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand-logo/quoupl.svg`

## 🔧 Implementation

Created `lib/utils/logo-url.ts` utility function that:
- Gets logo URL from Supabase Storage
- Falls back to `/images/quoupl.svg` if Supabase URL is not set
- Used in:
  - `app/login/page.tsx` - Login page logo
  - `components/cms/cms-nav.tsx` - CMS navigation logo
  - `components/cms/global-content-editor.tsx` - Default logo in editor

## ✅ Updated Files

- ✅ `app/login/page.tsx` - Uses `getLogoUrl()`
- ✅ `components/cms/cms-nav.tsx` - Uses `getLogoUrl()`
- ✅ `components/cms/global-content-editor.tsx` - Uses Supabase Storage URL
- ✅ `lib/utils/logo-url.ts` - New utility function
- ✅ Removed local `public/images/quoupl.svg` file

## 🔍 Verify Logo Path

Make sure the logo exists in Supabase Storage at:
- **Bucket**: `brand-assets`
- **Path**: `brand-logo/quoupl.svg`

If the path is different, update `lib/utils/logo-url.ts`:

```typescript
// Current:
return `${supabaseUrl}/storage/v1/object/public/brand-assets/brand-logo/quoupl.svg`

// If different path, update to:
return `${supabaseUrl}/storage/v1/object/public/brand-assets/your-path/quoupl.svg`
```

## 🧪 Test

1. **Check Supabase Storage**:
   - Go to Supabase Dashboard
   - Storage → `brand-assets` bucket
   - Verify `brand-logo/quoupl.svg` exists

2. **Test in CMS**:
   - Run `npm run dev`
   - Visit login page
   - Logo should load from Supabase Storage
   - Check browser Network tab to verify URL

3. **If 404 Error**:
   - Verify bucket name is `brand-assets`
   - Verify file path is `brand-logo/quoupl.svg`
   - Check bucket is public
   - Update path in `lib/utils/logo-url.ts` if different

## 📝 Notes

- Logo now loads from Supabase Storage (same as website)
- No local logo file needed
- Falls back gracefully if Supabase URL not set
- All logo references updated consistently

