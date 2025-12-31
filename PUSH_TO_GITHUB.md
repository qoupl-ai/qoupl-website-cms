# Push CMS to GitHub - Step by Step

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/qoupl-ai
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `qoupl-website-cms`
   - **Description**: "CMS for qoupl website"
   - **Visibility**: **Private** (recommended for CMS)
   - **DO NOT** check "Add a README file"
   - **DO NOT** check "Add .gitignore"
   - **DO NOT** check "Choose a license"
4. Click **"Create repository"**

## Step 2: Push Code

After creating the repository, run these commands:

```bash
cd /Users/int/Documents/GitHub/qoupl-website/qoupl-cms
git push -u origin main
```

If you get authentication errors, you may need to:

**Option A: Use GitHub CLI**
```bash
gh auth login
git push -u origin main
```

**Option B: Use SSH**
```bash
git remote set-url origin git@github.com:qoupl-ai/qoupl-website-cms.git
git push -u origin main
```

## Step 3: Verify

After pushing, check GitHub:
- All files should be visible
- README.md should be there
- Code structure should look correct

Then proceed to Vercel deployment!

