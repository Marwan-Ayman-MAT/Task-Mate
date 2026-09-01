# 📦 دليل تحميل وتشغيل تطبيق TaskMate

## ✅ الخطوة 1: تحميل الملفات

### الطريقة الأولى: تحميل ZIP (الأسهل)
1. اضغط على زر **"Download Project"** في أعلى اليمين
2. سيتم تحميل ملف `taskmate-project.zip`
3. فك ضغط الملف في مجلد على جهازك

### الطريقة الثانية: نسخ يدوي
قم بإنشاء المجلدات والملفات التالية على جهازك:

```
taskmate/
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── App.tsx
├── components/
│   ├── Auth.tsx
│   ├── Sidebar.tsx
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── AddTaskModal.tsx
│   ├── EditTaskModal.tsx
│   ├── CompletionCelebration.tsx
│   └── ui/
│       └── (جميع ملفات UI)
├── hooks/
│   ├── useTasks.ts
│   └── useCategories.ts
├── utils/
│   ├── theme.ts
│   └── supabase/
│       ├── client.ts
│       └── info.tsx
├── styles/
│   └── globals.css
└── supabase/
    └── migrations/
        └── 001_create_tables.sql
```

---

## 🚀 الخطوة 2: تشغيل التطبيق على جهازك

### المتطلبات:
- **Node.js** (النسخة 18 أو أحدث)
- **npm** أو **yarn**

### خطوات التشغيل:

#### 1. افتح Terminal/Command Prompt في مجلد المشروع

#### 2. ثبت المكتبات المطلوبة:
```bash
npm install
```

أو

```bash
yarn install
```

#### 3. شغل التطبيق:
```bash
npm run dev
```

أو

```bash
yarn dev
```

#### 4. افتح المتصفح على:
```
http://localhost:5173
```

---

## 🌐 الخطوة 3: رفع التطبيق على الإنترنت (مجاناً)

### خيار 1: Netlify (موصى به ✅)

1. **سجل حساب على** [Netlify](https://netlify.com)
2. **اربط حسابك بـ GitHub**
3. **ارفع المشروع:**
   ```bash
   npm run build
   ```
4. **اسحب مجلد `dist` إلى Netlify**
5. **تطبيقك شغال على رابط مجاني!** 🎉

### خيار 2: Vercel

1. سجل حساب على [Vercel](https://vercel.com)
2. ثبت Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. شغل:
   ```bash
   vercel
   ```
4. اتبع التعليمات

### خيار 3: GitHub Pages

1. ارفع المشروع على GitHub
2. في Settings → Pages
3. اختار Branch: main
4. احفظ

---

## 🔑 الخطوة 4: إعدادات Supabase (مهم!)

### التطبيق متصل بقاعدة بيانات Supabase موجودة:

**معلومات الاتصال الحالية:**
- Project ID: `ciwmzxrbcjhakzllfffj`
- URL: `https://ciwmzxrbcjhakzllfffj.supabase.co`

### إذا أردت إنشاء قاعدة بيانات خاصة بك:

1. **سجل حساب مجاني على** [Supabase](https://supabase.com)
2. **أنشئ مشروع جديد**
3. **في SQL Editor، شغل الكود:**
   - افتح ملف `/supabase/migrations/001_create_tables.sql`
   - انسخ الكود كامل
   - الصقه في SQL Editor
   - اضغط Run
4. **احصل على API Keys:**
   - Settings → API
   - انسخ `Project URL` و `anon public key`
5. **حدث ملف `/utils/supabase/info.tsx`:**
   ```typescript
   export const projectId = "مشروعك_هنا"
   export const publicAnonKey = "المفتاح_هنا"
   ```

---

## 📱 الخطوة 5: استخدام التطبيق كـ PWA (تطبيق موبايل)

### على Android:
1. افتح التطبيق في Chrome
2. اضغط على القائمة (⋮)
3. اختار **"Add to Home Screen"**
4. التطبيق هيظهر كأيقونة على الشاشة الرئيسية!

### على iPhone:
1. افتح التطبيق في Safari
2. اضغط على زر المشاركة
3. اختار **"Add to Home Screen"**
4. تطبيق جاهز للاستخدام!

---

## 🛠️ الملفات الأساسية المطلوبة:

### package.json (ثبت هذه المكتبات):
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dnd-touch-backend": "^16.0.1",
    "lucide-react": "latest",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

---

## ✨ مميزات التطبيق بعد التحميل:

✅ **يعمل بدون إنترنت** (بعد التحميل الأول)
✅ **سريع جداً** - لا يحتاج Figma
✅ **بياناتك محفوظة** في السحابة (Supabase)
✅ **يمكن استخدامه كتطبيق موبايل** (PWA)
✅ **مجاني 100%** للاستضافة والتشغيل
✅ **قابل للتخصيص** - كل الأكواد معك

---

## 🆘 حل المشاكل الشائعة:

### المشكلة: "Module not found"
**الحل:**
```bash
npm install
```

### المشكلة: "Port 5173 already in use"
**الحل:**
```bash
npm run dev -- --port 3000
```

### المشكلة: "Supabase connection error"
**الحل:** تأكد من:
- إنترنت شغال
- معلومات Supabase صحيحة في `/utils/supabase/info.tsx`

---

## 📞 محتاج مساعدة؟

جميع الملفات موجودة في المشروع ومُنظمة. فقط:
1. حمل الملفات
2. ثبت المكتبات (`npm install`)
3. شغل التطبيق (`npm run dev`)

**التطبيق جاهز 100% للاستخدام الفوري!** 🚀

---

## 📊 الإحصائيات:

- **عدد الملفات**: 70+ ملف
- **الحجم**: ~500 KB (بدون node_modules)
- **التقنيات**: React + TypeScript + Tailwind + Supabase
- **التوافق**: جميع المتصفحات الحديثة + موبايل

**استمتع باستخدام TaskMate! 🎉**
