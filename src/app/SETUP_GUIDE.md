# TaskMate - دليل الإعداد الكامل

## 📋 نظرة عامة

TaskMate هو تطبيق إدارة مهام كامل مع:
- ✅ Frontend (React + TypeScript + Tailwind CSS)
- ✅ Backend API (Supabase Edge Functions + Hono)
- ✅ قاعدة بيانات PostgreSQL
- ✅ نظام مصادقة (Authentication)
- ✅ حفظ دائم للبيانات

---

## 🚀 خطوات الإعداد

### الخطوة 1: إنشاء حساب Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب مجاني
3. أنشئ مشروع جديد (New Project)
4. احفظ المعلومات التالية:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGc...` (Public key)
   - **Service Role Key**: `eyJhbGc...` (Secret key - لا تشاركها!)

### الخطوة 2: إعداد قاعدة البيانات

1. افتح Supabase Dashboard
2. اذهب إلى **SQL Editor**
3. انسخ محتويات ملف `/supabase/migrations/001_create_tables.sql`
4. الصقه في SQL Editor واضغط **Run**

سيتم إنشاء:
- جدول `categories` للتصنيفات
- جدول `tasks` للمهام
- Row Level Security (RLS) policies
- Indexes للأداء الأمثل

### الخطوة 3: نشر Edge Functions

#### 3.1 تثبيت Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# أو باستخدام npm
npm install -g supabase
```

#### 3.2 تسجيل الدخول

```bash
supabase login
```

#### 3.3 ربط المشروع

```bash
supabase link --project-ref your-project-id
```

#### 3.4 نشر Functions

```bash
supabase functions deploy make-server-7e725d54
```

### الخطوة 4: تحديث ملف info.tsx

في ملف `/utils/supabase/info.tsx`، ضع معلومات مشروعك:

```typescript
export const projectId = 'your-project-id'; // من Project URL
export const publicAnonKey = 'your-anon-key'; // Anon public key
```

**⚠️ مهم جداً**: لا تضع `Service Role Key` في Frontend!

---

## 💾 حفظ الكود على جهازك

### الطريقة 1: تحميل من Figma Make

1. في Figma Make، اضغط على زر **Export** أو **Download**
2. سيتم تحميل ملف ZIP يحتوي على جميع الملفات
3. فك الضغط على جهازك

### الطريقة 2: Git Repository (موصى به)

```bash
# إنشاء repository جديد
git init
git add .
git commit -m "Initial commit - TaskMate full app"

# رفع على GitHub
git remote add origin https://github.com/yourusername/taskmate.git
git push -u origin main
```

---

## 🏃 تشغيل التطبيق محلياً

### 1. تثبيت Dependencies

```bash
npm install
# أو
yarn install
# أو
pnpm install
```

### 2. تشغيل Development Server

```bash
npm run dev
# أو
yarn dev
```

التطبيق سيعمل على: `http://localhost:5173`

---

## 📦 هيكل المشروع

```
taskmate/
├── /components/           # React components
│   ├── AddTaskModal.tsx
│   ├── EditTaskModal.tsx
│   ├── Auth.tsx          # صفحة تسجيل الدخول
│   ├── Sidebar.tsx
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   └── CompletionCelebration.tsx
│
├── /utils/
│   ├── /supabase/
│   │   ├── client.ts     # Supabase client
│   │   └── info.tsx      # Project credentials
│   ├── api.ts            # API functions
│   └── theme.ts          # Theme colors
│
├── /supabase/
│   ├── /functions/
│   │   └── /server/
│   │       └── index.tsx # Backend API
│   └── /migrations/
│       └── 001_create_tables.sql
│
├── /styles/
│   └── globals.css       # Global styles
│
├── App.tsx               # Main app component
└── index.tsx             # Entry point
```

---

## 🌐 نشر التطبيق على الإنترنت

### خيار 1: Vercel (سهل وسريع)

1. اذهب إلى [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Deploy!

```bash
# أو باستخدام CLI
npm i -g vercel
vercel
```

### خيار 2: Netlify

1. اذهب إلى [netlify.com](https://netlify.com)
2. Drag & drop مجلد المشروع
3. أو connect Git repository

### خيار 3: Supabase Hosting

```bash
supabase deploy
```

---

## 🔐 إعداد Authentication

التطبيق يدعم حالياً:
- ✅ Email/Password signup & login
- ✅ Session management
- ✅ Secure token storage

### إضافة Social Login (اختياري)

لإضافة تسجيل دخول Google/Facebook/GitHub:

1. اتبع الدليل: [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login)
2. Enable providers في Dashboard > Authentication > Providers
3. استخدم `supabase.auth.signInWithOAuth({ provider: 'google' })`

---

## 📊 المميزات المتاحة

### Frontend
- ✅ إضافة/تعديل/حذف المهام
- ✅ التعليقات على المهام
- ✅ المواعيد النهائية (Due dates)
- ✅ الجدولة (Scheduled dates)
- ✅ التصنيفات الملونة (6 فئات افتراضية)
- ✅ الفلترة (Today, Tomorrow, This Week, Unscheduled, All)
- ✅ البحث والترتيب
- ✅ السحب والإفلات (Drag & Drop)
- ✅ تتبع التقدم
- ✅ الاحتفال عند الإكمال
- ✅ Dark/Light Mode
- ✅ Responsive (Mobile & Desktop)
- ✅ Toast notifications

### Backend
- ✅ RESTful API
- ✅ Authentication
- ✅ PostgreSQL Database
- ✅ Row Level Security (RLS)
- ✅ Automatic data sync
- ✅ Error handling
- ✅ CORS enabled

---

## 🔧 التخصيص

### تغيير الألوان

عدل `/styles/globals.css`:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  ...
}
```

### إضافة تصنيفات جديدة

في `/App.tsx`:

```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'custom', name: 'Custom Category', color: '#FF6B6B' },
  // ...
];
```

### تعديل Sidebar

عدل `/components/Sidebar.tsx`

---

## 🐛 استكشاف الأخطاء

### خطأ: "Failed to fetch tasks"

- تحقق من Project URL و Anon Key في `/utils/supabase/info.tsx`
- تأكد من نشر Edge Functions بنجاح
- تحقق من تشغيل SQL migration

### خطأ: "Unauthorized"

- تأكد من تسجيل الدخول
- تحقق من صلاحية Access Token
- تأكد من RLS policies في قاعدة البيانات

### خطأ: "CORS error"

- تأكد من `cors()` middleware في `/supabase/functions/server/index.tsx`
- أعد نشر Edge Functions

---

## 📝 API Endpoints

```
POST   /make-server-7e725d54/auth/signup       # Create account
GET    /make-server-7e725d54/tasks             # Get all tasks
POST   /make-server-7e725d54/tasks             # Create task
PUT    /make-server-7e725d54/tasks/:id         # Update task
DELETE /make-server-7e725d54/tasks/:id         # Delete task
PUT    /make-server-7e725d54/tasks/bulk-update # Bulk update (reorder)
GET    /make-server-7e725d54/categories        # Get categories
POST   /make-server-7e725d54/categories        # Create category
```

**Headers المطلوبة:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 🎯 الخطوات التالية

1. ✅ أكمل إعداد Supabase
2. ✅ نشر Edge Functions
3. ✅ اختبر التطبيق محلياً
4. ✅ أضف بياناتك الخاصة
5. ✅ انشر على الإنترنت
6. ✅ شارك مع الأصدقاء! 🎉

---

## 🆘 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Console logs في المتصفح (F12)
2. تحقق من Supabase Logs في Dashboard
3. راجع الوثائق: [Supabase Docs](https://supabase.com/docs)

---

## 📄 الملفات الجاهزة للتحميل

جميع الملفات التالية جاهزة في المشروع:

### Frontend Files
- `/App.tsx` - Main application
- `/components/*.tsx` - All UI components
- `/utils/api.ts` - API client
- `/utils/supabase/client.ts` - Supabase client
- `/utils/theme.ts` - Theme system
- `/styles/globals.css` - Styles

### Backend Files
- `/supabase/functions/server/index.tsx` - API server
- `/supabase/migrations/001_create_tables.sql` - Database schema

### Configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind config (if needed)

---

## 🎉 مبروك!

الآن لديك تطبيق TaskMate كامل جاهز للاستخدام! 🚀

**ملاحظة:** للحصول على أفضل تجربة، استخدم Chrome أو Firefox أو Safari أحدث إصدار.

---

**صنع بـ ❤️ في Figma Make**
