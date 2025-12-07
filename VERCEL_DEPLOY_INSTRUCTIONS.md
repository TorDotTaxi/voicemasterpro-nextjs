# 🚀 Deploy VoiceMaster Pro lên Vercel - Hướng dẫn chi tiết

## ✅ Code đã được push lên GitHub thành công!

**Repository**: https://github.com/TorDotTaxi/voicemasterpro-nextjs

---

## 🌐 CÁCH 1: Deploy Qua Website (KHUYẾN NGHỊ - 5 PHÚT)

### Bước 1: Đăng nhập Vercel

1. Mở: **https://vercel.com/login**
2. Click **"Continue with GitHub"**
3. Đăng nhập GitHub nếu chưa đăng nhập
4. Click **"Authorize Vercel"** để cho phép truy cập

### Bước 2: Import Project

1. Sau khi đăng nhập, bạn sẽ thấy Vercel Dashboard
2. Click nút **"Add New..."** (góc phải trên)
3. Chọn **"Project"**
4. Trong danh sách repositories, tìm: **`voicemasterpro-nextjs`**
5. Click **"Import"** bên cạnh repository

### Bước 3: Configure Project

Vercel sẽ tự động detect Next.js. Bạn chỉ cần:

**Framework Preset**: Next.js ✅ (đã tự động chọn)

**Root Directory**: `./` (giữ nguyên)

**Build Settings** (đã tự động):
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Bước 4: Add Environment Variables (QUAN TRỌNG!)

Click **"Environment Variables"** và thêm **5 biến này**:

```
Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: <your_gemini_api_key>
```

```
Name: NEXT_PUBLIC_DEEPGRAM_API_KEY
Value: <your_deepgram_api_key>
```

```
Name: NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY
Value: <your_google_cloud_api_key>
```

```
Name: NEXT_PUBLIC_FPT_AI_API_KEY
Value: <your_fpt_ai_api_key>
```

```
Name: NEXT_PUBLIC_ASSEMBLY_AI_API_KEY
Value: <your_assemblyai_api_key>
```

🔐 **Where to get your API keys:**
- **Gemini**: https://makersuite.google.com/app/apikey
- **Deepgram**: https://console.deepgram.com/
- **Google Cloud**: https://console.cloud.google.com/apis/credentials
- **FPT AI**: https://fpt.ai/
- **AssemblyAI**: https://www.assemblyai.com/

**Lưu ý**: Chọn **"Production"**, **"Preview"**, và **"Development"** cho tất cả các biến.

### Bước 5: Deploy!

1. Click **"Deploy"**
2. Chờ 2-3 phút để Vercel build và deploy
3. Xem tiến trình build realtime trên màn hình

### Bước 6: XONG! 🎉

Khi deploy xong, bạn sẽ thấy:

✅ **"Congratulations! Your project has been deployed"**

Your app is live at: **`https://voicemasterpro-nextjs.vercel.app`**

Click vào link để xem app của bạn!

---

## 🤖 CÁCH 2: Deploy Qua Command Line (Nâng Cao)

Nếu bạn muốn deploy từ terminal:

### Bước 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Bước 2: Login

```powershell
vercel login
```

- Nhập email GitHub của bạn
- Check email và click link xác nhận

### Bước 3: Deploy

```powershell
vercel
```

Trả lời các câu hỏi:

```
Set up and deploy? [Y/n] Y
Which scope? [Your GitHub username]
Link to existing project? [y/N] N
What's your project's name? voicemasterpro-nextjs
In which directory is your code located? ./
Auto-detected Project Settings (Next.js): [Y/n] Y
```

### Bước 4: Add Environment Variables (CLI)

```powershell
vercel env add NEXT_PUBLIC_GEMINI_API_KEY
# Enter your Gemini API key when prompted

vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY
# Enter your Deepgram API key when prompted

vercel env add NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY
# Enter your Google Cloud API key when prompted

vercel env add NEXT_PUBLIC_FPT_AI_API_KEY
# Enter your FPT AI API key when prompted

vercel env add NEXT_PUBLIC_ASSEMBLY_AI_API_KEY
# Enter your AssemblyAI API key when prompted
```

Chọn **"Production"** cho mỗi biến.

### Bước 5: Deploy to Production

```powershell
vercel --prod
```

---

## 🔄 TỰ ĐỘNG DEPLOY KHI PUSH CODE (Đã Setup Sẵn!)

Sau khi deploy lần đầu, **mỗi khi bạn push code lên GitHub**, Vercel sẽ **TỰ ĐỘNG**:

1. ✅ Detect push
2. ✅ Pull code mới
3. ✅ Build project
4. ✅ Deploy to production
5. ✅ Gửi email thông báo

**Workflow từ giờ:**

```powershell
# 1. Sửa code
# ...

# 2. Commit và push
git add .
git commit -m "Update: feature mới"
git push

# 3. Vercel tự động deploy! ✅
# Chờ 2-3 phút là live!
```

---

## 📊 Kiểm Tra Deployment Status

### Trên Website

1. Vào: https://vercel.com/dashboard
2. Click vào project **"voicemasterpro-nextjs"**
3. Tab **"Deployments"** - xem lịch sử deploy
4. Tab **"Logs"** - xem build logs nếu có lỗi

### Qua CLI

```powershell
vercel logs
```

---

## 🎯 Custom Domain (Tùy chọn)

Nếu bạn muốn dùng domain riêng (ví dụ: voicemaster.com):

1. Vercel Dashboard → Project → Settings → Domains
2. Click **"Add"**
3. Nhập domain của bạn
4. Cấu hình DNS theo hướng dẫn
5. Chờ domain propagate (5-60 phút)

---

## 🔧 Troubleshooting

### Nếu Build Fail

1. Check build logs trên Vercel
2. Đảm bảo tất cả environment variables đã thêm
3. Verify code build thành công local: `npm run build`

### Nếu App Không Hoạt Động

1. Check console trong browser (F12)
2. Verify API keys đã được thêm đúng
3. Check Vercel logs: https://vercel.com/dashboard → Project → Logs

### Nếu Transcription Fail

1. Verify environment variables trên Vercel
2. Check API key limits (Deepgram, FPT AI)
3. Test với file audio nhỏ trước (<1MB)

---

## 📱 Mobile App Version (Tương lai)

Sau khi deploy web, bạn có thể:

1. **PWA (Progressive Web App)**:
   - User có thể "Add to Home Screen"
   - Hoạt động như native app
   - Đã config sẵn trong project

2. **React Native / Expo**:
   - Port code sang mobile app thực sự
   - Sử dụng lại các API services

---

## 🎉 THÀNH CÔNG!

Giờ bạn có:

✅ **GitHub Repository** - Version control & collaboration
✅ **Auto-Deploy Pipeline** - Push code → Auto deploy
✅ **Production URL** - App live toàn cầu
✅ **Global CDN** - Fast loading worldwide
✅ **SSL Certificate** - HTTPS secure
✅ **Error Handling** - Better user experience

---

## 📞 Your URLs

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/TorDotTaxi/voicemasterpro-nextjs |
| **Deploy here** | https://vercel.com/new |
| **Dashboard** | https://vercel.com/dashboard |
| **Live App** | https://voicemasterpro-nextjs-[your-hash].vercel.app |

---

**Next Steps:**

1. ✅ ~~Push to GitHub~~ (Done!)
2. 🚀 Deploy to Vercel (Follow steps above)
3. ✅ Test your live app
4. 🔄 Auto-deploy is ready!

**Happy Deploying!** 🎊

