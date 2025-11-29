# 🎯 Local Data Management Guide

## Overview
This application runs **100% locally** with no backend. All data is stored in your browser's **localStorage**. You have complete control - nothing is hardcoded.

---

## 🔓 Default Credentials

### Student Account
- **Username:** `student`
- **Password:** `student123`

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ You can create your own accounts by registering!

---

## 📊 Access Your Data

### Browser Console Method
Open your browser's Developer Tools (`F12` or `Right-click → Inspect`) and go to the **Console** tab.

#### View All Internships
```javascript
JSON.parse(localStorage.getItem('internships'))
```

#### View All Users
```javascript
JSON.parse(localStorage.getItem('users'))
```

#### View All Applications
```javascript
JSON.parse(localStorage.getItem('applications'))
```

#### View All Tasks
```javascript
JSON.parse(localStorage.getItem('tasks'))
```

#### View All Submissions
```javascript
JSON.parse(localStorage.getItem('submissions'))
```

---

## ✏️ Modify Data Directly

### Add New Internship
```javascript
const internships = JSON.parse(localStorage.getItem('internships')) || [];
internships.push({
  id: Date.now(),
  title: "Your Position",
  company: "Your Company",
  duration: "3 Months",
  location: "Remote",
  stipend: "₹25,000/month",
  description: "Your description",
  skills: ["Skill1", "Skill2"],
  type: "Full-time",
  applicants: 0,
  deadline: "2025-12-31",
  rating: 5.0,
  createdAt: new Date().toISOString()
});
localStorage.setItem('internships', JSON.stringify(internships));
location.reload(); // Refresh to see changes
```

### Create New User
```javascript
const users = JSON.parse(localStorage.getItem('users')) || [];
users.push({
  id: 'user-' + Date.now(),
  username: "newuser",
  email: "newuser@example.com",
  password: "password123",
  fullName: "Full Name",
  role: "student",
  isAdmin: false,
  college: "Your College",
  branch: "Your Branch",
  createdAt: new Date().toISOString()
});
localStorage.setItem('users', JSON.stringify(users));
location.reload();
```

### Update an Application Status
```javascript
const apps = JSON.parse(localStorage.getItem('applications')) || [];
apps[0].status = "Accepted"; // Change status (Pending, Accepted, Rejected)
apps[0].adminFeedback = "Great work!";
localStorage.setItem('applications', JSON.stringify(apps));
location.reload();
```

### Add a Task
```javascript
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.push({
  id: Date.now(),
  applicationId: 12345, // The application ID
  userId: "user-id",
  title: "Complete Assignment",
  description: "Do the assignment",
  completed: false,
  deadline: "2025-12-25",
  createdAt: new Date().toISOString()
});
localStorage.setItem('tasks', JSON.stringify(tasks));
location.reload();
```

---

## 🧹 Clear All Data

To start fresh:
```javascript
localStorage.clear();
location.reload();
```

---

## 🔄 Import Data from JSON

If you have a JSON file with users/internships:

```javascript
const newInternships = [
  { id: 1, title: "Position 1", company: "Company A", ... },
  { id: 2, title: "Position 2", company: "Company B", ... }
];
localStorage.setItem('internships', JSON.stringify(newInternships));
location.reload();
```

---

## 📋 Data Structure

### Internship Object
```javascript
{
  id: number,
  title: string,
  company: string,
  duration: string,
  location: string,
  stipend: string,
  description: string,
  skills: string[],
  type: string,
  applicants: number,
  deadline: string (ISO date),
  rating: number,
  createdAt: string (ISO date)
}
```

### User Object
```javascript
{
  id: string,
  username: string,
  email: string,
  password: string, // STORED LOCALLY (never send to server)
  fullName: string,
  role: string, // "student" or "admin"
  isAdmin: boolean,
  college: string,
  branch: string,
  createdAt: string (ISO date)
}
```

### Application Object
```javascript
{
  id: number,
  userId: string,
  internshipId: number,
  status: string, // "Pending", "Accepted", "Rejected"
  appliedDate: string (ISO date),
  adminFeedback: string
}
```

### Task Object
```javascript
{
  id: number,
  applicationId: number,
  userId: string,
  title: string,
  description: string,
  completed: boolean,
  deadline: string,
  adminFeedback: string,
  createdAt: string (ISO date)
}
```

### Submission Object
```javascript
{
  id: number,
  userId: string,
  taskId: number,
  fileName: string,
  fileData: string, // Base64 encoded
  status: string, // "Pending", "Approved", "Rejected"
  submittedAt: string (ISO date),
  adminFeedback: string
}
```

---

## ⚡ Useful Commands

### Copy All Data to Clipboard
```javascript
copy(JSON.stringify({
  internships: JSON.parse(localStorage.getItem('internships')),
  users: JSON.parse(localStorage.getItem('users')),
  applications: JSON.parse(localStorage.getItem('applications')),
  tasks: JSON.parse(localStorage.getItem('tasks')),
  submissions: JSON.parse(localStorage.getItem('submissions'))
}, null, 2))
```

### Count Total Items
```javascript
console.log('Internships:', JSON.parse(localStorage.getItem('internships')).length);
console.log('Users:', JSON.parse(localStorage.getItem('users')).length);
console.log('Applications:', JSON.parse(localStorage.getItem('applications')).length);
console.log('Tasks:', JSON.parse(localStorage.getItem('tasks')).length);
console.log('Submissions:', JSON.parse(localStorage.getItem('submissions')).length);
```

### Export Data as JSON File
```javascript
const data = {
  internships: JSON.parse(localStorage.getItem('internships')),
  users: JSON.parse(localStorage.getItem('users')),
  applications: JSON.parse(localStorage.getItem('applications')),
  tasks: JSON.parse(localStorage.getItem('tasks')),
  submissions: JSON.parse(localStorage.getItem('submissions'))
};
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'internship_data.json';
a.click();
```

---

## 🎨 How Everything is Dynamic

✅ **Add Internships** - Create unlimited internships through the UI or console  
✅ **Register Users** - Sign up as many users as you want  
✅ **Apply for Positions** - Any user can apply for any internship  
✅ **Manage Applications** - Accept/reject/comment on applications  
✅ **Assign Tasks** - Create tasks for applications  
✅ **Track Progress** - Monitor task completion  
✅ **Admin Controls** - Full admin panel to manage everything  

---

## 💾 Data Persistence

All data stays in your **browser's localStorage**. It persists even after:
- ❌ Page refresh
- ❌ Closing the browser
- ❌ Coming back days later

It's cleared only when:
- ✅ You clear browser cache
- ✅ You clear localStorage manually
- ✅ You use incognito/private mode (data is temporary)

---

## 🚀 No Backend Required!

You don't need:
- ❌ MongoDB
- ❌ Express server
- ❌ Environment variables
- ❌ API hosting

Everything runs **locally in the browser**. Perfect for:
- 🎓 Learning and prototyping
- 🧪 Testing features
- 📱 Offline usage
- 🔒 Complete data privacy

---

## 📝 Notes

- Passwords are stored locally (for demo purposes)
- Data is stored per browser/device
- Different browsers have separate data
- Clearing cache will delete all data
- No data sent to any server

**Happy learning! 🎉**
