# 📥 تعليمات تحميل المشروع على جهازك

## 🎯 الهدف
حفظ جميع ملفات تطبيق TaskMate على جهازك للاستخدام والتطوير المحلي

---

## 📋 قائمة الملفات المطلوبة

### ✅ الملفات الرئيسية (في المجلد الرئيسي)
```
□ package.json
□ package-lock.json (إن وجد)
□ vite.config.ts
□ tsconfig.json
□ tsconfig.node.json
□ index.html
□ README.md
□ DEPLOYMENT_GUIDE.md
□ DOWNLOAD_INSTRUCTIONS.md (هذا الملف)
```

### ✅ مجلد /src
```
src/
□ App.tsx
□ main.tsx
□ vite-env.d.ts
```

### ✅ مجلد /components
```
src/components/
□ Auth.tsx
□ Sidebar.tsx
□ TaskList.tsx
□ TaskItem.tsx
□ AddTaskModal.tsx
□ EditTaskModal.tsx
□ CompletionCelebration.tsx
```

### ✅ مجلد /components/ui
```
src/components/ui/
□ sheet.tsx
□ (أي ملفات UI أخرى)
```

### ✅ مجلد /hooks
```
src/hooks/
□ useTasks.ts
□ useCategories.ts
```

### ✅ مجلد /utils
```
src/utils/
□ theme.ts
```

### ✅ مجلد /utils/supabase
```
src/utils/supabase/
□ client.ts
□ info.tsx
```

### ✅ مجلد /styles
```
src/styles/
□ globals.css
```

### ✅ مجلد /supabase
```
supabase/
└── migrations/
    □ 001_initial_schema.sql
```

### ✅ مجلد /public (إن وجد)
```
public/
□ (أي ملفات ثابتة)
```

---

## 🚀 خطوات التحميل من Figma Make

### الطريقة 1: التحميل اليدوي (موصى بها)

1. **أنشئ مجلد جديد على جهازك**
   ```
   مثال: C:\Projects\taskmate-app
   أو: ~/Documents/taskmate-app
   ```

2. **احفظ كل ملف في موقعه الصحيح**
   
   مثال لحفظ App.tsx:
   - افتح `/App.tsx` في Figma Make
   - انسخ المحتوى كاملاً
   - أنشئ ملف `App.tsx` في `src/App.tsx`
   - الصق المحتوى واحفظ

3. **كرر العملية لكل ملف** حسب القائمة أعلاه

### الطريقة 2: استخدام Terminal/CMD

إذا كان لديك إمكانية تصدير من Figma Make:

```bash
# أنشئ المجلد الرئيسي
mkdir taskmate-app
cd taskmate-app

# أنشئ الهيكل
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/utils/supabase
mkdir -p src/styles
mkdir -p supabase/migrations
mkdir -p public
```

---

## 📝 بعد التحميل

### 1. تحقق من الهيكل

تأكد أن المجلد يبدو كالتالي:

```
taskmate-app/
├── package.json ✅
├── vite.config.ts ✅
├── tsconfig.json ✅
├── index.html ✅
├── README.md ✅
├── DEPLOYMENT_GUIDE.md ✅
├── DOWNLOAD_INSTRUCTIONS.md ✅
│
├── public/
│
├── src/
│   ├── App.tsx ✅
│   ├── main.tsx ✅
│   ├── components/
│   │   ├── Auth.tsx ✅
│   │   ├── Sidebar.tsx ✅
│   │   ├── TaskList.tsx ✅
│   │   ├── TaskItem.tsx ✅
│   │   ├── AddTaskModal.tsx ✅
│   │   ├── EditTaskModal.tsx ✅
│   │   ├── CompletionCelebration.tsx ✅
│   │   └── ui/
│   │       └── sheet.tsx ✅
│   ├── hooks/
│   │   ├── useTasks.ts ✅
│   │   └── useCategories.ts ✅
│   ├── utils/
│   │   ├── theme.ts ✅
│   │   └── supabase/
│   │       ├── client.ts ✅
│   │       └── info.tsx ✅
│   └── styles/
│       └── globals.css ✅
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql ✅
```

### 2. تثبيت التبعيات

افتح Terminal/CMD في مجلد المشروع:

```bash
npm install
```

سيقوم بتحميل جميع المكتبات المطلوبة (~200MB)

### 3. اختبار التشغيل المحلي

```bash
npm run dev
```

يجب أن يعمل على: `http://localhost:5173`

---

## ⚠️ ملاحظات مهمة

### إذا كانت بعض الملفات ناقصة:

1. **package.json مفقود؟**
   ```bash
   npm init -y
   # ثم أضف التبعيات يدوياً
   ```

2. **index.html مفقود؟**
   أنشئ ملف بهذا المحتوى:
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>TaskMate</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```

3. **main.tsx مفقود؟**
   أنشئ ملف بهذا المحتوى:
   ```typescript
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App'
   import './styles/globals.css'

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   )
   ```

4. **vite.config.ts مفقود؟**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```

---

## 🔧 ملفات الإعداد الإضافية

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### .gitignore
```
node_modules
dist
.env
.env.local
*.log
.DS_Store
```

---

## 📦 التبعيات المطلوبة (package.json)

إذا احتجت إنشاء package.json من الصفر:

```json
{
  "name": "taskmate-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.294.0",
    "motion": "^10.16.4",
    "react": "^18.2.0",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dnd-touch-backend": "^16.0.1",
    "react-dom": "^18.2.0",
    "sonner": "^1.2.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

---

## ✅ Checklist التحميل

قبل المتابعة للخطوة التالية، تأكد من:

- [ ] تم إنشاء مجلد المشروع
- [ ] تم نسخ جميع الملفات في المواقع الصحيحة
- [ ] تم إنشاء جميع المجلدات الفرعية
- [ ] package.json موجود وصحيح
- [ ] index.html موجود
- [ ] App.tsx و main.tsx موجودان
- [ ] جميع المكونات في /components
- [ ] جميع الـ hooks في /hooks
- [ ] ملفات Supabase في /utils/supabase
- [ ] ملف SQL في /supabase/migrations
- [ ] تم تشغيل `npm install` بنجاح
- [ ] تم تشغيل `npm run dev` بنجاح

---

## 🎯 الخطوة التالية

بعد اكتمال التحميل، انتقل إلى:
👉 **DEPLOYMENT_GUIDE.md** - لإعداد Supabase والنشر

---

## 💡 نصائح

1. **استخدم IDE جيد**
   - Visual Studio Code (موصى به)
   - WebStorm
   - Sublime Text

2. **استخدم Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **احفظ نسخة احتياطية**
   - على Google Drive
   - على GitHub (Private)
   - على USB Drive

---

## 🆘 المساعدة

إذا واجهت مشاكل:

1. تحقق من أن Node.js مثبت: `node --version`
2. تحقق من أن npm يعمل: `npm --version`
3. احذف node_modules وأعد التثبيت:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

**حظاً موفقاً! 🚀**
