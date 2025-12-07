# 🔄 Auto-Deploy Setup - Tự Động Deploy Khi Push Code

## ✅ Đã Setup Sẵn

Git repository đã được khởi tạo thành công với **28 files**!

```
✅ Git initialized
✅ Username: TorDotTaxi
✅ Remote added: https://github.com/TorDotTaxi/voicemasterpro-nextjs.git
✅ Initial commit created
```

---

## 🚀 Bước Tiếp Theo: Push Lên GitHub

### Bước 1: Tạo Repository trên GitHub (2 phút)

1. **Mở**: https://github.com/new
2. **Repository name**: `voicemasterpro-nextjs`
3. **Description**: `VoiceMaster Pro - AI Audio Transcription App`
4. **Public** ✅ (khuyến nghị) hoặc Private
5. **KHÔNG** check "Add README", "Add .gitignore", "Choose a license"
6. Click **"Create repository"**

### Bước 2: Tạo Personal Access Token (2 phút)

**Tại sao cần token?**
- GitHub yêu cầu token thay vì password từ 2021

**Cách tạo:**

1. **Mở**: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `VoiceMaster Pro - Auto Deploy`
4. **Expiration**: `No expiration` (hoặc 90 days)
5. **Select scopes**:
   - ✅ **repo** (check tất cả)
   - ✅ **workflow**
   - ✅ **write:packages**
6. Click **"Generate token"**
7. **COPY TOKEN NGAY** - chỉ hiện 1 lần!

Token sẽ có dạng: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**LƯU TOKEN VÀO FILE TEXT!** (Bạn sẽ cần dùng nhiều lần)

### Bước 3: Push Code Lên GitHub (1 phút)

Chạy lệnh này:

```powershell
git push -u origin main
```

**Khi hỏi username/password:**
```
Username for 'https://github.com': TorDotTaxi
Password for 'https://TorDotTaxi@github.com': [PASTE TOKEN Ở ĐÂY]
```

**✅ Success!** Code đã lên GitHub: https://github.com/TorDotTaxi/voicemasterpro-nextjs

---

## 🌐 Auto-Deploy với Vercel (3 phút)

### Bước 1: Kết Nối Vercel với GitHub

1. **Mở**: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. **Authorize Vercel** - cho phép truy cập repositories

### Bước 2: Import Project

1. Trên Vercel Dashboard, click **"Add New..."** → **"Project"**
2. **Import Git Repository**
3. Tìm và chọn: `TorDotTaxi/voicemasterpro-nextjs`
4. Click **"Import"**

### Bước 3: Configure Project

**Framework Preset**: Next.js ✅ (tự động detect)

**Root Directory**: `./`

**Build Settings** (đã tự động):
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Bước 4: Add Environment Variables (QUAN TRỌNG!)

Click **"Environment Variables"** và thêm **5 variables**:

```
Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
```

```
Name: NEXT_PUBLIC_DEEPGRAM_API_KEY
Value: 4acc334413436e98e24c15b7e48dc2ced6216f2c
```

```
Name: NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY
Value: AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
```

```
Name: NEXT_PUBLIC_FPT_AI_API_KEY
Value: dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
```

```
Name: NEXT_PUBLIC_ASSEMBLY_AI_API_KEY
Value: abee456b3f9342fc90cfc44aeb2f2501
```

### Bước 5: Deploy!

Click **"Deploy"**

⏱️ Chờ 2-3 phút...

**✅ DONE!** 

Your app is live at: `https://voicemasterpro-nextjs.vercel.app`

---

## 🔄 AUTO-DEPLOY WORKFLOW (ĐÃ HOẠT ĐỘNG!)

**Từ giờ, mỗi khi bạn push code:**

```powershell
# 1. Sửa code bất kỳ
# ...

# 2. Commit và push
git add .
git commit -m "Update: thêm feature mới"
git push

# 3. Vercel TỰ ĐỘNG:
#    ✅ Detect push
#    ✅ Pull code mới
#    ✅ Run build
#    ✅ Deploy to production
#    ✅ Update live site
```

**Không cần làm gì thêm!** 🎉

---

## 🤖 GitHub Actions CI/CD (Đã Setup Sẵn!)

File `.github/workflows/deploy.yml` đã có sẵn trong project!

### Enable GitHub Actions

1. Repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**

**Add these secrets:**

```
Name: GEMINI_API_KEY
Secret: AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
```

```
Name: DEEPGRAM_API_KEY
Secret: 4acc334413436e98e24c15b7e48dc2ced6216f2c
```

```
Name: GOOGLE_CLOUD_API_KEY
Secret: AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
```

```
Name: FPT_AI_API_KEY
Secret: dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
```

```
Name: ASSEMBLY_AI_API_KEY
Secret: abee456b3f9342fc90cfc44aeb2f2501
```

**For Vercel auto-deploy (Optional):**

Get these from Vercel:
- **VERCEL_TOKEN**: https://vercel.com/account/tokens
- **VERCEL_ORG_ID**: Project Settings → General
- **VERCEL_PROJECT_ID**: Project Settings → General

```
Name: VERCEL_TOKEN
Secret: [your-token]

Name: VERCEL_ORG_ID
Secret: [your-org-id]

Name: VERCEL_PROJECT_ID
Secret: [your-project-id]
```

### What GitHub Actions Does

**Every push triggers:**
1. ✅ Install dependencies
2. ✅ Run ESLint
3. ✅ Build project
4. ✅ Test on Node 18 & 20
5. ✅ Deploy to Vercel (if tokens added)

**View results**: Repo → **Actions** tab

---

## 📊 Complete Auto-Deploy Flow

```
1. Code Changes Locally
   ↓
2. git add . && git commit -m "..." && git push
   ↓
3. GitHub receives push
   ↓
4. GitHub Actions runs (lint, build, test)
   ├─ Pass ✅ → Continue
   └─ Fail ❌ → Email notification
   ↓
5. Vercel detects GitHub push
   ↓
6. Vercel builds & deploys
   ├─ Preview: branch-name.vercel.app
   └─ Production: main branch → your-app.vercel.app
   ↓
7. Email: "Deployment Ready"
   ↓
8. Live! ✅
```

**Total time**: ~2-3 minutes from push to live! ⚡

---

## 🎯 Daily Development Workflow

### Morning: Start Coding

```powershell
cd voicemasterpro-nextjs
npm run dev
# Open http://localhost:3000
# Code features...
```

### Afternoon: Push Updates

```powershell
git add .
git commit -m "Feature: add X"
git push
# Auto-deploy starts! ✅
# Check: https://your-app.vercel.app
```

### Evening: Monitor

- Check Vercel dashboard
- Review GitHub Actions
- Monitor production logs

---

## 📱 Branch Strategy

### Main Branch
```powershell
git checkout main
git pull
# Always deployable to production
```

### Feature Branches
```powershell
git checkout -b feature/new-ui
# Make changes...
git add .
git commit -m "WIP: new UI"
git push origin feature/new-ui
# Creates preview deployment!
# URL: feature-new-ui-xxx.vercel.app
```

### Merge to Production
```powershell
git checkout main
git merge feature/new-ui
git push
# Deploys to production! ✅
```

---

## 🔔 Notifications

### Email Notifications

Vercel sends emails for:
- ✅ Deployment started
- ✅ Deployment succeeded
- ❌ Deployment failed
- ⚠️ Build warnings

### Slack Integration (Optional)

1. Vercel → Project → Settings → Git
2. Click "Add Integration"
3. Select Slack
4. Configure webhook

---

## 🚨 Rollback (Nếu Deploy Lỗi)

### Quick Rollback on Vercel

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click **"..."** → **"Promote to Production"**
4. Confirm

**Instant rollback!** ⚡

### Rollback via Git

```powershell
git revert HEAD
git push
# Deploys previous version
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)

1. Vercel → Project → Analytics
2. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### GitHub Insights

1. Repo → Insights
2. View:
   - Commit activity
   - Contributors
   - Traffic
   - Dependencies

---

## ⚡ Speed Optimizations

### Vercel Edge Network

Your app is automatically deployed to:
- ✅ Global CDN (70+ locations)
- ✅ Edge caching
- ✅ Automatic SSL
- ✅ DDoS protection

### Build Optimizations

```javascript
// next.config.js (already configured)
module.exports = {
  swcMinify: true,        // Fast minification
  reactStrictMode: true,  // Best practices
  compress: true,         // Gzip compression
}
```

---

## 📈 Scaling

### Free Tier Limits

- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Unlimited team members
- ✅ Custom domains

### If You Need More

- **Pro**: $20/month
  - 1TB bandwidth
  - Advanced analytics
  - Priority support

---

## ✅ Checklist

- [ ] Repository created on GitHub
- [ ] Personal Access Token created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Auto-deploy tested (push small change)
- [ ] GitHub Actions secrets added (optional)
- [ ] Notifications configured (optional)

---

## 🎉 Success!

Bạn giờ có:

✅ **GitHub Repository**
- Version control
- Collaboration ready
- Code backup

✅ **Auto-Deploy Pipeline**
- Push → Auto deploy
- Preview deployments
- Instant rollback

✅ **CI/CD**
- Automated testing
- Lint checks
- Build verification

✅ **Production App**
- Global CDN
- Auto SSL
- DDoS protection

**Professional setup complete!** 🚀

---

## 📞 Your URLs

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/TorDotTaxi/voicemasterpro-nextjs |
| **Live App** | https://voicemasterpro-nextjs.vercel.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **GitHub Actions** | https://github.com/TorDotTaxi/voicemasterpro-nextjs/actions |

---

**Happy Auto-Deploying!** 🎊
