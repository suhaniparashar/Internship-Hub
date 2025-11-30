# InternHub - Internship Management Platform

A complete React-based internship management platform with student and admin dashboards, task management, and application tracking.

## Tech Stack

### Frontend
- **React 19.1** - UI library for building user interfaces
- **React Router DOM 7.9** - Client-side routing
- **Vite 7.1** - Next-generation frontend build tool
- **CSS3** - Custom styling with responsive design and dark mode

### Development Tools
- **ESLint 9.36** - Code linting and quality
- **Vite Plugin React** - Fast Refresh for React

### Data Storage
- **LocalStorage API** - Client-side data persistence
- **JSON** - Data format for internships and user data

### Deployment
- **Vercel** - Production deployment platform

## Project Structure

```
Internship-Hub/
├── public/
│   ├── data/
│   │   └── internships.json    # Sample internship data
│   ├── data.html               # Standalone data dashboard
│   └── dashboard.html          # Public dashboard
├── src/
│   ├── api/
│   │   └── index.js            # LocalStorage API layer
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with dark mode toggle
│   │   ├── Footer.jsx          # Site footer
│   │   ├── ProtectedRoute.jsx  # Auth route protection
│   │   └── FileSubmission.jsx  # File upload component
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── hooks/
│   │   └── useLocalStorage.js  # Custom localStorage hook
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # User authentication
│   │   ├── Register.jsx        # User registration
│   │   ├── Dashboard.jsx       # Student dashboard
│   │   ├── Internships.jsx     # Browse internships
│   │   ├── Enrolled.jsx        # Enrolled internships and tasks
│   │   ├── Status.jsx          # Application status tracking
│   │   ├── About.jsx           # About page
│   │   └── Admin.jsx           # Admin dashboard
│   ├── styles/
│   │   └── Admin.css           # Admin-specific styles
│   ├── utils/
│   │   ├── auth.js             # Authentication helpers
│   │   ├── data.js             # Sample data
│   │   ├── formatDate.js       # Date formatting utilities
│   │   └── notifications.js    # Toast and modal notifications
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # Global styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Base styles
├── package.json
├── vite.config.js
├── vercel.json
└── eslint.config.js
```

## Features

### Student Features
- **Browse Internships** - Search, filter by type/location/stipend, sort by various criteria
- **One-Click Apply** - Quick application submission
- **Save Jobs** - Bookmark internships for later
- **Dashboard** - View statistics, recent applications, recommended internships
- **Application Tracking** - Real-time status updates (Applied, Under Review, Shortlisted, Selected, Rejected)
- **Task Management** - View and manage assigned tasks from admin
- **Dark Mode** - Toggle between light and dark themes

### Admin Features
- **Internship Management** - Add, edit, delete internships
- **Application Review** - View all applications, update status, provide evaluation
- **User Management** - View registered users, assign tasks
- **Task Assignment** - Assign tasks to shortlisted/selected candidates
- **Logical Flow Control** - Status transitions follow proper workflow
- **Evaluation System** - Mark candidates as Selected/Rejected with feedback

### Authentication
- User registration with validation
- Login with username or email
- Protected routes for authenticated users
- Admin-only routes

### UI/UX
- Responsive design for all screen sizes
- Dark mode support
- Toast notifications
- Confirmation modals
- Loading states
- Form validation with feedback

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/suhaniparashar/Internship-Hub.git

# Navigate to project directory
cd Internship-Hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Accounts

### Student Account
- **Username:** demo
- **Password:** demo123

### Admin Account
- **Username:** admin
- **Password:** admin123

## Data Models

### User
```javascript
{
  id: number,
  username: string,
  email: string,
  password: string,
  college: string,
  branch: string,
  role: 'user' | 'admin',
  isAdmin: boolean,
  createdAt: ISO date
}
```

### Internship
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
  type: 'Full-time' | 'Part-time' | 'Remote',
  applicants: number,
  deadline: ISO date,
  rating: number
}
```

### Application
```javascript
{
  id: number,
  internshipId: number,
  userId: number,
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected',
  evaluation: 'Pending' | 'Selected' | 'Rejected',
  appliedAt: ISO date,
  tasks: Task[]
}
```

### Task
```javascript
{
  id: number,
  title: string,
  description: string,
  status: 'Pending' | 'Completed',
  assignedAt: ISO date,
  completedAt: ISO date | null
}
```

## Application Status Flow

```
Applied → Under Review → Shortlisted → Selected
                                    ↘ Rejected
```

- **Applied**: Initial state when user applies
- **Under Review**: Admin is reviewing the application
- **Shortlisted**: Candidate passed initial screening
- **Selected**: Candidate is selected for the internship
- **Rejected**: Application rejected (can happen from Under Review or Shortlisted)

## Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Home | `/` | Public | Landing page with features |
| About | `/about` | Public | About the platform |
| Internships | `/internships` | Public | Browse all internships |
| Login | `/login` | Public | User login |
| Register | `/register` | Public | User registration |
| Dashboard | `/dashboard` | User | Student dashboard |
| Enrolled | `/enrolled` | User | Enrolled internships and tasks |
| Status | `/status` | User | Application status tracking |
| Admin | `/admin` | Admin | Admin dashboard |

## API Functions (LocalStorage)

### User APIs
- `userAPI.getAll()` - Get all users
- `userAPI.getById(id)` - Get user by ID
- `userAPI.create(user)` - Register new user
- `userAPI.login(identifier, password)` - Authenticate user

### Internship APIs
- `internshipAPI.getAll()` - Get all internships
- `internshipAPI.getById(id)` - Get internship by ID
- `internshipAPI.create(internship)` - Add new internship
- `internshipAPI.update(id, data)` - Update internship
- `internshipAPI.delete(id)` - Delete internship

### Application APIs
- `applicationAPI.getAll()` - Get all applications
- `applicationAPI.getByUser(userId)` - Get user's applications
- `applicationAPI.create(application)` - Submit application
- `applicationAPI.updateStatus(id, status)` - Update application status
- `applicationAPI.updateEvaluation(id, evaluation)` - Update evaluation

### Task APIs
- `taskAPI.getByApplication(appId)` - Get tasks for application
- `taskAPI.create(task)` - Create new task
- `taskAPI.updateStatus(id, status)` - Update task status
- `taskAPI.delete(id)` - Delete task

## Dark Mode

Toggle dark mode using the button in the navbar. The preference is saved in localStorage and persists across sessions.

## Author

**Suhani Parashar**
- GitHub: [@suhaniparashar](https://github.com/suhaniparashar)
- University: KL University
- Roll ID: 2400033073
