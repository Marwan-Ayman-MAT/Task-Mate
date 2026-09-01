# 📥 دليل تحميل المشروع - TaskMate

## كيفية حفظ جميع ملفات المشروع على جهازك

---

## 🗂️ الملفات المطلوبة

### ✅ **الملفات الأساسية (يجب نسخها)**

#### 1. المكونات الرئيسية
```
/App.tsx                          - التطبيق الأصلي (يعمل بدون إنترنت)
/AppWithAuth.tsx                  - التطبيق الكامل مع قاعدة بيانات
```

#### 2. مكونات الواجهة
```
/components/
├── Auth/
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
├── Sidebar.tsx
├── TaskList.tsx
├── TaskItem.tsx
├── AddTaskModal.tsx
├── EditTaskModal.tsx
├── CompletionCelebration.tsx
└── EmptyState.tsx
```

#### 3. Backend و API
```
/supabase/
├── functions/server/
│   └── index.tsx                - Server API
└── migrations/
    └── schema.sql               - Database setup
```

#### 4. الأدوات المساعدة
```
/utils/
├── api.ts                       - دوال الاتصال بالـ API
├── theme.ts                     - إعدادات الألوان
└── supabase/
    ├── client.ts                - Supabase client
    └── info.tsx                 - معلومات المشروع
```

#### 5. التصميم
```
/styles/
└── globals.css                  - الأنماط العامة
```

#### 6. التوثيق
```
/README.md                       - دليل الاستخدام الشامل
/DOWNLOAD_GUIDE.md              - هذا الملف
```

---

## 💾 طريقة التحميل

### الطريقة 1: النسخ اليدوي (موصى بها)

1. **افتح كل ملف في القائمة أعلاه**
2. **انسخ محتوى الملف كاملاً**
3. **احفظه في نفس المسار على جهازك**

مثال:
- افتح `/App.tsx` في المتصفح
- اضغط Ctrl+A (تحديد الكل)
- اضغط Ctrl+C (نسخ)
- افتح محرر نصوص على جهازك
- اضغط Ctrl+V (لصق)
- احفظ كـ `App.tsx`

### الطريقة 2: استخدام أدوات المطور

```javascript
// افتح Console في المتصفح (F12)
// استخدم هذا الكود لتحميل كل ملف:

async function downloadFile(path) {
  const response = await fetch(path);
  const content = await response.text();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = path.split('/').pop();
  a.click();
}

// مثال:
downloadFile('/App.tsx');
downloadFile('/components/TaskList.tsx');
```

---

## 📁 هيكل المجلدات المطلوب

أنشئ هذا الهيكل على جهازك:

```
taskmate/
│
├── public/
│   └── index.html
│
├── src/
│   ├── App.tsx
│   ├── AppWithAuth.tsx
│   │
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── AddTaskModal.tsx
│   │   ├── EditTaskModal.tsx
│   │   ├── CompletionCelebration.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── utils/
│   │   ├── api.ts
│   │   ├── theme.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── info.tsx
│   │
│   └── styles/
│       └── globals.css
│
├── supabase/
│   ├── functions/
│   │   └── server/
│   │       └── index.tsx
│   └── migrations/
│       └── schema.sql
│
├── README.md
├── DOWNLOAD_GUIDE.md
├── package.json
└── vite.config.ts
```

---

## 🔧 ملفات الإعداد الإضافية

### `package.json`
```json
{
  "name": "taskmate",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dnd-touch-backend": "^16.0.1",
    "lucide-react": "^0.292.0",
    "sonner": "^1.2.0",
    "motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

### `tsconfig.json`
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

### `index.html` (في مجلد public)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskMate - Task Management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
// استخدم AppWithAuth للنسخة الكاملة مع Backend
import App from './AppWithAuth';
// أو استخدم App للنسخة بدون Backend
// import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🚀 خطوات التشغيل بعد التحميل

### 1. تثبيت Dependencies
```bash
cd taskmate
npm install
```

### 2. إعداد Supabase
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ مشروع جديد
- نفذ الـ SQL من `supabase/migrations/schema.sql`
- احصل على Project URL و Anon Key
- حدّث `/utils/supabase/info.tsx`

### 3. تشغيل المشروع
```bash
npm run dev
```

سيعمل على: `http://localhost:3000`

### 4. البناء للإنتاج
```bash
npm run build
```

الملفات ستكون في مجلد `dist/`

---

## 🌐 نشر التطبيق

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### GitHub Pages
1. ادفع الكود لـ GitHub
2. فعّل GitHub Pages في الإعدادات
3. اختر branch `main` ومجلد `/docs`

---

## 🔑 متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

ثم حدّث `info.tsx`:
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_URL;
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

## ✅ قائمة المراجعة

قبل النشر، تأكد من:

- [ ] نسخت جميع الملفات المذكورة أعلاه
- [ ] أنشأت هيكل المجلدات الصحيح
- [ ] أنشأت ملفات الإعداد (package.json، vite.config.ts، إلخ)
- [ ] ثبّت جميع الـ dependencies
- [ ] أعددت قاعدة بيانات Supabase
- [ ] نفذت schema.sql في Supabase
- [ ] حدّثت معلومات الاتصال بـ Supabase
- [ ] اختبرت التطبيق محلياً
- [ ] بنيت للإنتاج بنجاح

---

## 🆘 حل المشاكل

### خطأ: Cannot find module
```bash
npm install
```

### خطأ: Supabase connection failed
- تأكد من صحة Project URL و Anon Key
- تحقق من أن المشروع نشط على Supabase

### خطأ: Database tables not found
- نفذ schema.sql في SQL Editor على Supabase

### خطأ: Build failed
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع قسم حل المشاكل أعلاه
2. تحقق من console المتصفح
3. راجع [Supabase Docs](https://supabase.com/docs)
4. راجع [Vite Docs](https://vitejs.dev)

---

## 🎉 تهانينا!

الآن لديك نسخة كاملة من TaskMate على جهازك!

**ميزات النسخة المحلية:**
✅ تعمل بدون إنترنت (النسخة App.tsx)
✅ قاعدة بيانات حقيقية (النسخة AppWithAuth.tsx)
✅ جميع المميزات الكاملة
✅ قابل للتخصيص بالكامل
✅ يمكن نشره على أي منصة

---

**Made with ❤️ for you!**
