# Setup GitHub Repository

## Option 1: Create Repository on GitHub (Recommended)

1. Go to https://github.com/qoupl-ai
2. Click **"New repository"**
3. Repository name: `qoupl-website-cms`
4. Description: "CMS for qoupl website"
5. Set to **Private** (recommended for CMS)
6. **Don't** initialize with README, .gitignore, or license
7. Click **"Create repository"**

## Option 2: Push Existing Code

After creating the repository, run:

```bash
cd qoupl-cms
git remote set-url origin https://github.com/qoupl-ai/qoupl-website-cms.git
git push -u origin main
```

If you get authentication errors, you may need to:
- Use SSH: `git@github.com:qoupl-ai/qoupl-website-cms.git`
- Or set up GitHub CLI: `gh auth login`

## Verify Push

After pushing, verify on GitHub:
- All files are present
- README.md is visible
- Code structure looks correct

Then proceed to Vercel deployment!

