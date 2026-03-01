# CI/CD Setup for WordVault

This repository uses GitHub Actions to automate deployments for all parts of the WordVault application.

## 📋 Overview

| Component | Trigger | Workflow | Destination |
|-----------|---------|----------|-------------|
| **Backend API** | Push to `main` (backend changes) | `deploy-backend.yml` | Fly.io |
| **Database Migrations** | Push to `main` (migration changes) | `run-migrations.yml` | Neon Production DB |
| **Web (Next.js)** | Push to `main` (web/shared changes) | `deploy-web.yml` | Netlify |
| **Mobile (iOS)** | Push version tag (`v*.*.*`) | `build-mobile.yml` | EAS → TestFlight |

---

## 🔐 Required Secrets

Before the workflows can run, you need to add these secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Backend & Database
- `FLY_API_TOKEN` - Fly.io API token for deploying the backend
  - Get it: `flyctl auth token`
- `DATABASE_URL_PRODUCTION` - Neon production database connection string
  - Format: `postgresql://user:password@host/db?sslmode=require`

### Web
- `NETLIFY_AUTH_TOKEN` - Netlify personal access token
  - Get it: [Netlify User Settings → Applications → Personal access tokens](https://app.netlify.com/user/applications#personal-access-tokens)
- `NETLIFY_SITE_ID` - Your Netlify site ID
  - Get it: Netlify site settings → Site details → Site ID

### Mobile
- `EXPO_TOKEN` - Expo/EAS access token
  - Get it: `eas login` then `eas whoami --json` (use the access token)
  - Or create one at: [expo.dev → Account Settings → Access Tokens](https://expo.dev/settings/access-tokens)

---

## 🚀 How to Use

### Deploying Backend & Web

1. **Make changes** to backend, web, or shared code
2. **Create a PR** and merge to `main`
3. **GitHub Actions automatically**:
   - Deploys backend to Fly.io (if backend files changed)
   - Runs migrations (if migration files changed)
   - Deploys web to Netlify (if web/shared files changed)

### Releasing Mobile App

Mobile builds are **manual** via version tags:

1. **Merge all mobile changes** to `main`
2. **Update version** in `mobile/app.json`:
   ```json
   {
     "expo": {
       "version": "1.1.0"
     }
   }
   ```
3. **Create and push a version tag**:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
4. **GitHub Actions automatically**:
   - Builds iOS app with EAS
   - Submits to TestFlight for internal testing
5. **Test in TestFlight**, then manually submit to App Store when ready

---

## 📝 Workflow Details

### 1. Backend Deployment (`deploy-backend.yml`)
- **Triggers**: Changes to `backend/` on `main`
- **Steps**:
  1. Checkout code
  2. Setup Fly.io CLI
  3. Deploy to Fly.io
  4. Health check verification
- **Runtime**: ~2-3 minutes

### 2. Database Migrations (`run-migrations.yml`)
- **Triggers**: Changes to `backend/migrations/` or `backend/src/db/schema.sql` on `main`
- **Steps**:
  1. Checkout code
  2. Install dependencies
  3. Run `npm run migrate:up` against production DB
- **Runtime**: ~1-2 minutes
- **⚠️ Important**: Migrations run against **production database**

### 3. Web Deployment (`deploy-web.yml`)
- **Triggers**: Changes to `web/` or `shared/` on `main`
- **Steps**:
  1. Checkout code
  2. Install shared & web dependencies
  3. Build Next.js
  4. Deploy to Netlify
- **Runtime**: ~3-5 minutes

### 4. Mobile Build (`build-mobile.yml`)
- **Triggers**: Push version tag matching `v*.*.*` (e.g., `v1.0.0`, `v1.2.3`)
- **Steps**:
  1. Checkout code
  2. Setup Expo/EAS
  3. Build iOS with EAS (production profile)
  4. Submit to TestFlight
- **Runtime**: ~15-20 minutes (EAS build time)
- **⚠️ Note**: Auto-submits to **TestFlight only**, not App Store

---

## 🔄 Typical Development Flow

### For Backend/Web Changes
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 4. Open PR on GitHub, review, and merge to main
# ✅ GitHub Actions automatically deploys

# 5. Verify deployment
# - Backend: https://wordshelf-api.fly.dev/health
# - Web: https://wordvaultvocab.netlify.app
```

### For Mobile Releases
```bash
# 1. Merge all mobile changes to main first

# 2. Bump version in mobile/app.json
# "version": "1.0.0" → "1.1.0"

# 3. Commit version bump
git add mobile/app.json
git commit -m "Bump version to 1.1.0"
git push origin main

# 4. Tag and push
git tag v1.1.0
git push origin v1.1.0

# ✅ GitHub Actions builds and submits to TestFlight

# 5. Test in TestFlight
# 6. Manually submit to App Store when ready
```

---

## 🛠 Troubleshooting

### Workflow fails with "Secret not found"
- Verify all secrets are added in GitHub repo settings
- Secret names must match exactly (case-sensitive)

### Backend deployment fails
- Check Fly.io app exists: `flyctl apps list`
- Verify `FLY_API_TOKEN` has correct permissions

### Migration fails
- Check `DATABASE_URL_PRODUCTION` is correct
- Ensure migrations are idempotent (can run multiple times safely)

### Mobile build fails
- Verify `EXPO_TOKEN` is valid: `eas whoami`
- Check EAS environment variables are set: `eas env:list --environment production`
- Ensure iOS credentials are configured: `eas credentials`

### Web deployment fails
- Check Netlify site exists and `NETLIFY_SITE_ID` is correct
- Verify `NETLIFY_AUTH_TOKEN` has deploy permissions

---

## 📦 Local Development

These workflows only run on GitHub. For local development:

- **Backend**: `cd backend && npm run dev` (uses local `.env`)
- **Web**: `cd web && npm run dev` (uses local `.env`)
- **Mobile**: `cd mobile && npx expo start` (uses local `.env`)

Environment variables for local development are in `.env` files (not committed to git).

---

## 🔒 Security Notes

- Never commit `.env` files or secrets to git
- All production secrets are stored in GitHub Secrets
- Mobile env vars are stored in EAS (not in git)
- Review all PRs before merging to `main` (production deploys automatically)

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Fly.io Deploy Docs](https://fly.io/docs/apps/deploy/)
- [Netlify Deploy Docs](https://docs.netlify.com/configure-builds/overview/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
