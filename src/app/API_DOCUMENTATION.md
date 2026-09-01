# 🔌 TaskMate API Documentation

Complete API reference for TaskMate backend.

## 🌐 Base URL

```
https://your-project-id.supabase.co/functions/v1/make-server-7e725d54
```

Replace `your-project-id` with your actual Supabase project ID.

---

## 🔐 Authentication

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "user_metadata": {
      "name": "John Doe"
    }
  },
  "message": "User created successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Email and password are required"
}
```

### Sign In

Use Supabase client on frontend:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

const accessToken = data.session?.access_token;
```

### Sign Out

```typescript
await supabase.auth.signOut();
```

---

## 📝 Tasks API

All task endpoints require authentication.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint:** `GET /tasks`

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "text": "Complete project documentation",
      "comment": "Include API docs and setup guide",
      "completed": false,
      "due_date": "2024-12-20T00:00:00Z",
      "scheduled_date": "2024-12-15T00:00:00Z",
      "category_id": "work",
      "order": 0,
      "created_at": "2024-12-13T10:00:00Z",
      "updated_at": "2024-12-13T10:00:00Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized - Invalid token"
}
```

### Create Task

Add a new task.

**Endpoint:** `POST /tasks`

**Body:**
```json
{
  "text": "Buy groceries",
  "comment": "Milk, eggs, bread",
  "completed": false,
  "dueDate": 1702857600000,
  "scheduledDate": 1702771200000,
  "categoryId": "shopping",
  "order": 0
}
```

**Response (201 Created):**
```json
{
  "task": {
    "id": "new-uuid",
    "user_id": "user-uuid",
    "text": "Buy groceries",
    "comment": "Milk, eggs, bread",
    "completed": false,
    "due_date": "2024-12-18T00:00:00Z",
    "scheduled_date": "2024-12-17T00:00:00Z",
    "category_id": "shopping",
    "order": 0,
    "created_at": "2024-12-13T10:30:00Z",
    "updated_at": "2024-12-13T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Task text is required"
}
```

### Update Task

Modify an existing task.

**Endpoint:** `PUT /tasks/:id`

**Body (all fields optional):**
```json
{
  "text": "Buy groceries - Updated",
  "comment": "Milk, eggs, bread, cheese",
  "completed": true,
  "dueDate": 1702944000000,
  "scheduledDate": 1702857600000,
  "categoryId": "shopping",
  "order": 1
}
```

**Response (200 OK):**
```json
{
  "task": {
    "id": "task-uuid",
    "user_id": "user-uuid",
    "text": "Buy groceries - Updated",
    "comment": "Milk, eggs, bread, cheese",
    "completed": true,
    "due_date": "2024-12-19T00:00:00Z",
    "scheduled_date": "2024-12-18T00:00:00Z",
    "category_id": "shopping",
    "order": 1,
    "created_at": "2024-12-13T10:30:00Z",
    "updated_at": "2024-12-13T11:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Task not found"
}
```

### Delete Task

Remove a task permanently.

**Endpoint:** `DELETE /tasks/:id`

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response (401/404):**
```json
{
  "error": "Task not found"
}
```

### Bulk Update Tasks

Update multiple tasks at once (useful for reordering).

**Endpoint:** `PUT /tasks/bulk-update`

**Body:**
```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "order": 0,
      "completed": false
    },
    {
      "id": "task-uuid-2",
      "order": 1,
      "completed": false
    },
    {
      "id": "task-uuid-3",
      "order": 2,
      "completed": true
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Tasks updated successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Tasks must be an array"
}
```

---

## 🏷️ Categories API

Manage task categories.

### Get All Categories

Retrieve all categories for the authenticated user.

**Endpoint:** `GET /categories`

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "name": "Work",
      "color": "#3b82f6",
      "created_at": "2024-12-13T10:00:00Z",
      "updated_at": "2024-12-13T10:00:00Z"
    },
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "name": "Personal",
      "color": "#10b981",
      "created_at": "2024-12-13T10:00:00Z",
      "updated_at": "2024-12-13T10:00:00Z"
    }
  ]
}
```

### Create Category

Add a new category.

**Endpoint:** `POST /categories`

**Body:**
```json
{
  "name": "Fitness",
  "color": "#ec4899"
}
```

**Response (201 Created):**
```json
{
  "category": {
    "id": "new-uuid",
    "user_id": "user-uuid",
    "name": "Fitness",
    "color": "#ec4899",
    "created_at": "2024-12-13T11:00:00Z",
    "updated_at": "2024-12-13T11:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Category name is required"
}
```

---

## 🔍 Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "TaskMate API is running"
}
```

---

## 📊 Data Models

### Task Object

```typescript
interface Task {
  id: string;              // UUID
  user_id: string;         // UUID (owner)
  text: string;            // Task title/description
  comment?: string;        // Optional notes
  completed: boolean;      // Completion status
  due_date?: string;       // ISO 8601 date
  scheduled_date?: string; // ISO 8601 date
  category_id?: string;    // UUID reference
  order: number;           // Display order
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### Category Object

```typescript
interface Category {
  id: string;         // UUID
  user_id: string;    // UUID (owner)
  name: string;       // Category name
  color: string;      // Hex color code
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

---

## 🛡️ Security

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- View their own data
- Insert their own data
- Update their own data
- Delete their own data

### Authentication

- Access tokens expire after session ends
- Use `supabase.auth.getSession()` to check for active session
- Refresh tokens automatically handled by Supabase client

### Best Practices

1. **Never expose Service Role Key** in frontend code
2. **Always use Authorization header** for protected endpoints
3. **Validate input** on both frontend and backend
4. **Handle errors gracefully** and log for debugging
5. **Use HTTPS** in production

---

## ⚡ Rate Limits

Supabase free tier limits:
- 500MB database storage
- 2GB file storage
- 2GB data transfer
- 50,000 monthly active users
- 500,000 Edge Function invocations

For production apps with high traffic, consider upgrading.

---

## 🔄 Frontend Integration

### Using the API Client

```typescript
import * as api from './utils/api';

// Get tasks
const tasks = await api.getTasks(accessToken);

// Create task
const newTask = await api.createTask(accessToken, {
  text: 'New task',
  comment: 'Task notes',
  dueDate: Date.now() + 86400000, // Tomorrow
  categoryId: 'work'
});

// Update task
const updated = await api.updateTask(accessToken, taskId, {
  text: 'Updated task',
  completed: true
});

// Delete task
await api.deleteTask(accessToken, taskId);

// Bulk update
await api.bulkUpdateTasks(accessToken, [
  { id: 'task1', order: 0, completed: false },
  { id: 'task2', order: 1, completed: false }
]);
```

### Error Handling

```typescript
try {
  const tasks = await api.getTasks(accessToken);
  console.log('Tasks loaded:', tasks);
} catch (error) {
  console.error('Failed to load tasks:', error.message);
  toast.error(`Error: ${error.message}`);
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Sign up
curl -X POST https://your-project-id.supabase.co/functions/v1/make-server-7e725d54/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Get tasks (replace TOKEN with your access token)
curl -X GET https://your-project-id.supabase.co/functions/v1/make-server-7e725d54/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create task
curl -X POST https://your-project-id.supabase.co/functions/v1/make-server-7e725d54/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test task","completed":false,"order":0}'
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables:
   - `base_url`: Your Supabase function URL
   - `access_token`: Your auth token
3. Test each endpoint

---

## 📝 Changelog

### v1.0.0 (2024-12-13)
- Initial API release
- Task CRUD operations
- Category management
- User authentication
- Bulk update support

---

## 🆘 Support

For API issues:
1. Check Supabase Dashboard > Functions > Logs
2. Verify authentication token is valid
3. Ensure database migrations are applied
4. Check CORS settings if browser errors occur

---

**Made with ❤️ using Figma Make + Supabase**
