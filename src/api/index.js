// ============================================
// LOCAL STORAGE ONLY - NO BACKEND REQUIRED
// ALL DATA IS 100% LOCAL, DYNAMIC & PERSISTENT
// ============================================

// Initialize localStorage with comprehensive demo data
const initializeLocalStorage = () => {
  if (!localStorage.getItem('internships')) {
    const defaultInternships = [
      {
        id: 1,
        title: "Frontend Developer Intern",
        company: "TechCorp India",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹15,000/month",
        description: "Build responsive web applications using React and modern JavaScript. Work with a dynamic team to create engaging user experiences.",
        skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-31",
        rating: 4.5,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Backend Developer Intern",
        company: "CloudSoft",
        duration: "4 Months",
        location: "Bangalore",
        stipend: "₹18,000/month",
        description: "Develop scalable backend services using Node.js, Express, and MongoDB. Learn about REST APIs and microservices architecture.",
        skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Docker"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-25",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "Full Stack Developer Intern",
        company: "WebVision Solutions",
        duration: "3 Months",
        location: "Delhi",
        stipend: "₹16,000/month",
        description: "Work on full stack projects combining frontend and backend development. Gain practical experience in modern web development.",
        skills: ["React", "Node.js", "MongoDB", "SQL", "AWS"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-15",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: "UI/UX Designer Intern",
        company: "CreativeStudio",
        duration: "2 Months",
        location: "Remote",
        stipend: "₹12,000/month",
        description: "Design beautiful and intuitive user interfaces. Learn about design principles, prototyping, and user research methodologies.",
        skills: ["Figma", "Adobe XD", "Prototyping", "CSS", "User Research"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-01-10",
        rating: 4.4,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        title: "Data Science Intern",
        company: "Analytics Pro",
        duration: "4 Months",
        location: "Remote",
        stipend: "₹20,000/month",
        description: "Analyze data and build predictive models using Python. Work with machine learning algorithms and big data technologies.",
        skills: ["Python", "Machine Learning", "SQL", "Pandas", "TensorFlow"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-20",
        rating: 4.8,
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: "DevOps Engineer Intern",
        company: "InfraCloud",
        duration: "3 Months",
        location: "Pune",
        stipend: "₹17,000/month",
        description: "Learn CI/CD pipelines, containerization, and cloud infrastructure. Work with Docker, Kubernetes, and cloud platforms.",
        skills: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-28",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        title: "Mobile App Developer Intern",
        company: "AppWorks",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹16,000/month",
        description: "Build native and cross-platform mobile applications. Experience developing for iOS and Android platforms.",
        skills: ["React Native", "Flutter", "JavaScript", "Git", "API Integration"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-05",
        rating: 4.5,
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        title: "Database Administrator Intern",
        company: "DataVault",
        duration: "3 Months",
        location: "Mumbai",
        stipend: "₹15,000/month",
        description: "Manage and optimize databases. Learn about SQL, indexing, backup strategies, and performance tuning.",
        skills: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Database Design"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-30",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 9,
        title: "QA Testing Intern",
        company: "QualityFirst",
        duration: "2 Months",
        location: "Remote",
        stipend: "₹10,000/month",
        description: "Learn software testing methodologies. Perform manual and automated testing on web and mobile applications.",
        skills: ["Manual Testing", "Selenium", "JIRA", "Test Cases", "Bug Reporting"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-01-20",
        rating: 4.3,
        createdAt: new Date().toISOString()
      },
      {
        id: 10,
        title: "Cybersecurity Intern",
        company: "SecureNet",
        duration: "4 Months",
        location: "Hyderabad",
        stipend: "₹19,000/month",
        description: "Learn cybersecurity principles and practices. Work on security audits, penetration testing, and security implementations.",
        skills: ["Network Security", "Penetration Testing", "Cryptography", "Linux", "Security Tools"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-15",
        rating: 4.9,
        createdAt: new Date().toISOString()
      },
      {
        id: 11,
        title: "Cloud Architect Intern",
        company: "CloudMasters",
        duration: "4 Months",
        location: "Remote",
        stipend: "₹18,000/month",
        description: "Design and deploy cloud infrastructure. Learn about AWS, Azure, GCP and infrastructure as code.",
        skills: ["AWS", "Azure", "Terraform", "CloudFormation", "Architecture"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-22",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 12,
        title: "AI/ML Engineer Intern",
        company: "AILabs",
        duration: "4 Months",
        location: "Remote",
        stipend: "₹21,000/month",
        description: "Develop AI and machine learning solutions. Work with neural networks, deep learning, and NLP models.",
        skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-18",
        rating: 4.8,
        createdAt: new Date().toISOString()
      },
      {
        id: 13,
        title: "Business Analyst Intern",
        company: "ConsultPro",
        duration: "3 Months",
        location: "Delhi",
        stipend: "₹13,000/month",
        description: "Analyze business requirements and create technical specifications. Learn about stakeholder management and project planning.",
        skills: ["Requirement Analysis", "Jira", "Confluence", "Documentation", "Communication"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-08",
        rating: 4.4,
        createdAt: new Date().toISOString()
      },
      {
        id: 14,
        title: "Blockchain Developer Intern",
        company: "ChainTech",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹19,000/month",
        description: "Build blockchain applications and smart contracts. Learn about Web3 technologies and decentralized systems.",
        skills: ["Solidity", "Ethereum", "Web3", "JavaScript", "Smart Contracts"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-26",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 15,
        title: "Software Engineer - Java Intern",
        company: "EnterpriseSoft",
        duration: "4 Months",
        location: "Bangalore",
        stipend: "₹17,000/month",
        description: "Develop robust enterprise applications using Java. Learn about OOP, design patterns, and enterprise architecture.",
        skills: ["Java", "Spring Boot", "Hibernate", "JDBC", "Design Patterns"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-31",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 16,
        title: "DevOps & Site Reliability Intern",
        company: "ReliabilityFirst",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹17,500/month",
        description: "Ensure system reliability and infrastructure stability. Work on monitoring, logging, and incident management.",
        skills: ["Prometheus", "Grafana", "ELK Stack", "Linux", "Kubernetes"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-29",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 17,
        title: "Vue.js Developer Intern",
        company: "FrontendExperts",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹15,500/month",
        description: "Build interactive web applications with Vue.js. Learn state management, routing, and component architecture.",
        skills: ["Vue.js", "Vuex", "Vue Router", "JavaScript", "API Integration"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-12",
        rating: 4.5,
        createdAt: new Date().toISOString()
      },
      {
        id: 18,
        title: "Angular Developer Intern",
        company: "AngularMasters",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹16,000/month",
        description: "Develop enterprise web applications with Angular. Learn about dependency injection, services, and RxJS.",
        skills: ["Angular", "TypeScript", "RxJS", "Services", "Routing"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-10",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 19,
        title: "Python Backend Developer Intern",
        company: "PythonPro",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹16,500/month",
        description: "Build scalable backends using Django or Flask. Learn about web frameworks, ORM, and API development.",
        skills: ["Python", "Django", "Flask", "SQLAlchemy", "REST APIs"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-27",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 20,
        title: "GraphQL Developer Intern",
        company: "GraphQLInnovators",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹17,000/month",
        description: "Build modern APIs using GraphQL. Learn about schema design, resolvers, and client-server communication.",
        skills: ["GraphQL", "Apollo", "JavaScript", "API Design", "Database Queries"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-23",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 21,
        title: "Content Management System Intern",
        company: "CMSBuilders",
        duration: "2 Months",
        location: "Remote",
        stipend: "₹12,000/month",
        description: "Develop features for content management systems. Learn about CMS architecture, plugins, and customization.",
        skills: ["WordPress", "PHP", "MySQL", "JavaScript", "CMS Development"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-01-15",
        rating: 4.3,
        createdAt: new Date().toISOString()
      },
      {
        id: 22,
        title: "Marketing Automation Intern",
        company: "MarketingTech",
        duration: "2 Months",
        location: "Remote",
        stipend: "₹11,000/month",
        description: "Work on marketing automation platforms. Learn about email campaigns, lead generation, and analytics.",
        skills: ["HubSpot", "Marketo", "Analytics", "Email Marketing", "Segmentation"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-01-18",
        rating: 4.2,
        createdAt: new Date().toISOString()
      },
      {
        id: 23,
        title: "API Development Intern",
        company: "APIGurus",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹16,000/month",
        description: "Design and develop RESTful and GraphQL APIs. Learn about authentication, rate limiting, and API documentation.",
        skills: ["REST", "GraphQL", "Swagger", "Authentication", "Postman"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-24",
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: 24,
        title: "Web Performance Optimization Intern",
        company: "PerfEdge",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹15,500/month",
        description: "Optimize web application performance. Learn about caching, compression, bundling, and performance monitoring.",
        skills: ["Performance Tuning", "Webpack", "Lighthouse", "Caching", "CDN"],
        type: "Full-time",
        applicants: 0,
        deadline: "2026-01-05",
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: 25,
        title: "Accessibility Specialist Intern",
        company: "AccessibleWeb",
        duration: "2 Months",
        location: "Remote",
        stipend: "₹13,000/month",
        description: "Ensure web applications are accessible to all users. Learn about WCAG standards, screen readers, and accessibility testing.",
        skills: ["WCAG", "Accessibility Testing", "A11y", "HTML", "CSS"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-01-20",
        rating: 4.5,
        createdAt: new Date().toISOString()
      },
      {
        id: 26,
        title: "Open Source Contributor Program",
        company: "OpenSourceHub",
        duration: "Flexible",
        location: "Remote",
        stipend: "₹5,000/month + Rewards",
        description: "Contribute to open source projects. Learn about version control, collaboration, and community-driven development.",
        skills: ["Git", "GitHub", "Open Source", "Collaboration", "Technical Writing"],
        type: "Part-time",
        applicants: 0,
        deadline: "2026-02-28",
        rating: 4.4,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('internships', JSON.stringify(defaultInternships));
  }

  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: 'user-1',
        username: 'student',
        email: 'student@internhub.com',
        password: 'student123',
        fullName: 'Raj Kumar',
        role: 'student',
        isAdmin: false,
        college: 'Delhi University',
        branch: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-2',
        username: 'priya',
        email: 'priya@internhub.com',
        password: 'priya123',
        fullName: 'Priya Sharma',
        role: 'student',
        isAdmin: false,
        college: 'Mumbai University',
        branch: 'Information Technology',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-3',
        username: 'amit',
        email: 'amit@internhub.com',
        password: 'amit123',
        fullName: 'Amit Patel',
        role: 'student',
        isAdmin: false,
        college: 'Bangalore Institute of Tech',
        branch: 'Computer Engineering',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-4',
        username: 'neha',
        email: 'neha@internhub.com',
        password: 'neha123',
        fullName: 'Neha Singh',
        role: 'student',
        isAdmin: false,
        college: 'Pune University',
        branch: 'Electronics & Comm',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-5',
        username: 'vikram',
        email: 'vikram@internhub.com',
        password: 'vikram123',
        fullName: 'Vikram Verma',
        role: 'student',
        isAdmin: false,
        college: 'Hyderabad Tech',
        branch: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-6',
        username: 'sneha',
        email: 'sneha@internhub.com',
        password: 'sneha123',
        fullName: 'Sneha Reddy',
        role: 'student',
        isAdmin: false,
        college: 'Chennai Institute',
        branch: 'Information Technology',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-7',
        username: 'rohit',
        email: 'rohit@internhub.com',
        password: 'rohit123',
        fullName: 'Rohit Gupta',
        role: 'student',
        isAdmin: false,
        college: 'Ahmedabad University',
        branch: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-8',
        username: 'divya',
        email: 'divya@internhub.com',
        password: 'divya123',
        fullName: 'Divya Rao',
        role: 'student',
        isAdmin: false,
        college: 'Kolkata Institute',
        branch: 'Electronics Engineering',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-9',
        username: 'arjun',
        email: 'arjun@internhub.com',
        password: 'arjun123',
        fullName: 'Arjun Malhotra',
        role: 'student',
        isAdmin: false,
        college: 'Chandigarh University',
        branch: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-10',
        username: 'ananya',
        email: 'ananya@internhub.com',
        password: 'ananya123',
        fullName: 'Ananya Mishra',
        role: 'student',
        isAdmin: false,
        college: 'Lucknow University',
        branch: 'Information Technology',
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@internhub.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin',
        isAdmin: true,
        college: 'Admin',
        branch: 'Admin',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }

  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
  }
};

// Initialize on module load
initializeLocalStorage();

// ============================================
// USER API
// ============================================
export const userAPI = {
  register: (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(u => u.username === userData.username)) {
          reject(new Error('Username already exists'));
          return;
        }

        const newUser = {
          id: 'user-' + Date.now(),
          ...userData,
          password: userData.password,
          role: userData.role || 'student',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  },

  login: (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
          reject(new Error('Invalid credentials'));
          return;
        }

        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },

  getAllUsers: () => {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      resolve(users);
    });
  },

  updateUser: (userId, updates) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        resolve(users[userIndex]);
      } catch (error) {
        reject(error);
      }
    });
  },

  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// INTERNSHIP API
// ============================================
export const internshipAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      const internships = JSON.parse(localStorage.getItem('internships') || '[]');
      resolve(internships);
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const internships = JSON.parse(localStorage.getItem('internships') || '[]');
      const internship = internships.find(i => i.id == id);
      
      if (!internship) {
        reject(new Error('Internship not found'));
        return;
      }
      
      resolve(internship);
    });
  },

  create: (internshipData) => {
    return new Promise((resolve) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        
        const newInternship = {
          id: Math.max(...internships.map(i => i.id), 0) + 1,
          ...internshipData,
          applicants: 0,
          createdAt: new Date().toISOString()
        };

        internships.push(newInternship);
        localStorage.setItem('internships', JSON.stringify(internships));
        resolve(newInternship);
      } catch (error) {
        resolve({ error: error.message });
      }
    });
  },

  update: (id, updates) => {
    return new Promise((resolve, reject) => {
      try {
        let internships = JSON.parse(localStorage.getItem('internships') || '[]');
        const index = internships.findIndex(i => i.id == id);

        if (index === -1) {
          reject(new Error('Internship not found'));
          return;
        }

        internships[index] = { ...internships[index], ...updates };
        localStorage.setItem('internships', JSON.stringify(internships));
        resolve(internships[index]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        let internships = JSON.parse(localStorage.getItem('internships') || '[]');
        internships = internships.filter(i => i.id != id);
        localStorage.setItem('internships', JSON.stringify(internships));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  },

  search: (query) => {
    return new Promise((resolve) => {
      const internships = JSON.parse(localStorage.getItem('internships') || '[]');
      const filtered = internships.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.company.toLowerCase().includes(query.toLowerCase()) ||
        i.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(filtered);
    });
  }
};

// ============================================
// APPLICATION API
// ============================================
export const applicationAPI = {
  create: (applicationData) => {
    return new Promise((resolve) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        
        const newApplication = {
          id: 'app-' + Date.now(),
          ...applicationData,
          status: 'Applied',
          appliedDate: new Date().toISOString()
        };

        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Update internship applicants count
        internshipAPI.getAll().then(internships => {
          const internship = internships.find(i => i.id == applicationData.internshipId);
          if (internship) {
            internship.applicants = (internship.applicants || 0) + 1;
            internshipAPI.update(internship.id, { applicants: internship.applicants });
          }
        });

        resolve(newApplication);
      } catch (error) {
        resolve({ error: error.message });
      }
    });
  },

  getByUserId: (userId) => {
    return new Promise((resolve) => {
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const userApps = applications.filter(a => a.userId === userId);
      resolve(userApps);
    });
  },

  getAll: () => {
    return new Promise((resolve) => {
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      resolve(applications);
    });
  },

  updateStatus: (applicationId, status) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const appIndex = applications.findIndex(a => a.id === applicationId);

        if (appIndex === -1) {
          reject(new Error('Application not found'));
          return;
        }

        applications[appIndex].status = status;
        localStorage.setItem('applications', JSON.stringify(applications));
        resolve(applications[appIndex]);
      } catch (error) {
        reject(error);
      }
    });
  },

  addFeedback: (applicationId, feedback) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const appIndex = applications.findIndex(a => a.id === applicationId);

        if (appIndex === -1) {
          reject(new Error('Application not found'));
          return;
        }

        applications[appIndex].adminFeedback = feedback;
        localStorage.setItem('applications', JSON.stringify(applications));
        resolve(applications[appIndex]);
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// TASK API
// ============================================
export const taskAPI = {
  create: (taskData) => {
    return new Promise((resolve) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        const newTask = {
          id: 'task-' + Date.now(),
          ...taskData,
          completed: false,
          createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve(newTask);
      } catch (error) {
        resolve({ error: error.message });
      }
    });
  },

  getByUserId: (userId) => {
    return new Promise((resolve) => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const userTasks = tasks.filter(t => t.userId === userId);
      resolve(userTasks);
    });
  },

  getAll: () => {
    return new Promise((resolve) => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      resolve(tasks);
    });
  },

  update: (taskId, updates) => {
    return new Promise((resolve, reject) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
          reject(new Error('Task not found'));
          return;
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve(tasks[taskIndex]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (taskId) => {
    return new Promise((resolve, reject) => {
      try {
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// SUBMISSION API
// ============================================
export const submissionAPI = {
  create: (submissionData) => {
    return new Promise((resolve) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        
        const newSubmission = {
          id: 'sub-' + Date.now(),
          ...submissionData,
          status: 'Pending',
          submittedAt: new Date().toISOString()
        };

        submissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        resolve(newSubmission);
      } catch (error) {
        resolve({ error: error.message });
      }
    });
  },

  getByUserId: (userId) => {
    return new Promise((resolve) => {
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const userSubs = submissions.filter(s => s.userId === userId);
      resolve(userSubs);
    });
  },

  getAll: () => {
    return new Promise((resolve) => {
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      resolve(submissions);
    });
  },

  updateStatus: (submissionId, status, feedback = '') => {
    return new Promise((resolve, reject) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const subIndex = submissions.findIndex(s => s.id === submissionId);

        if (subIndex === -1) {
          reject(new Error('Submission not found'));
          return;
        }

        submissions[subIndex] = {
          ...submissions[subIndex],
          status,
          adminFeedback: feedback
        };
        localStorage.setItem('submissions', JSON.stringify(submissions));
        resolve(submissions[subIndex]);
      } catch (error) {
        reject(error);
      }
    });
  }
};
