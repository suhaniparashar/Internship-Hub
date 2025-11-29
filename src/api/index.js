// ============================================
// LOCAL STORAGE ONLY - NO BACKEND REQUIRED
// 100+ INTERNSHIPS, 100+ USERS - PRODUCTION DATA
// ============================================

const generateInternships = () => {
  const companies = [
    'TechCorp India', 'CloudSoft', 'WebVision Solutions', 'CreativeStudio', 'Analytics Pro',
    'InfraCloud', 'AppWorks', 'DataVault', 'QualityFirst', 'SecureNet', 'CloudMasters',
    'AILabs', 'ConsultPro', 'ChainTech', 'EnterpriseSoft', 'ReliabilityFirst', 'FrontendExperts',
    'AngularMasters', 'PythonPro', 'GraphQLInnovators', 'CMSBuilders', 'MarketingTech', 'APIGurus',
    'PerfEdge', 'AccessibleWeb', 'OpenSourceHub', 'DevOpsNinja', 'CloudWave', 'ByteBridge',
    'CodeChain', 'DataFlow Systems', 'ElasticSearch Pro', 'FutureTech', 'GlobalSync', 'HyperScale',
    'InnovateLabs', 'JetStream Technologies', 'KubernetesHub', 'LambdaWorks', 'MegaData', 'NexusNet',
    'OmniCloud', 'PipelineIO', 'QuantumLeap', 'RoboticsHub', 'SyncWorks', 'TurboStack'
  ];

  const titles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
    'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Mobile Developer', 'Database Administrator',
    'Cloud Architect', 'Machine Learning Engineer', 'Business Analyst', 'Blockchain Developer',
    'Java Developer', 'SRE (Site Reliability Engineer)', 'Vue.js Developer', 'Angular Developer',
    'Python Developer', 'GraphQL Specialist', 'CMS Developer', 'Performance Engineer',
    'Accessibility Specialist', 'API Developer', 'Security Engineer', 'IoT Developer',
    'Game Developer', 'AR/VR Developer', 'Embedded Systems Engineer', 'Unix/Linux Admin',
    'Network Engineer', 'Systems Architect', 'Product Manager', 'Scrum Master',
    'Technical Writer', 'Solutions Architect', 'Integration Engineer', 'Test Automation Engineer',
    'Penetration Tester', 'Microservices Developer', 'Containerization Specialist', 'Web Performance Engineer'
  ];

  const skills = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform',
    'Jenkins', 'GitLab CI', 'GitHub Actions', 'Ansible', 'Prometheus', 'Grafana', 'ELK Stack', 'Kafka',
    'GraphQL', 'REST APIs', 'gRPC', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Webpack',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'Git',
    'Linux', 'Bash', 'Microservices', 'OAuth 2.0', 'JWT', 'Security', 'Testing', 'JIRA', 'Figma',
    'Sketch', 'Prototyping', 'UX Research', 'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'Agile',
    'Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'RabbitMQ', 'Nginx', 'Apache', 'CI/CD'
  ];

  const locations = [
    'Remote', 'Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Hyderabad', 'Gurgaon', 'Noida', 'Chennai',
    'Kolkata', 'Indore', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Surat'
  ];

  const internships = [];
  const internshipTitles = new Set();

  for (let i = 0; i < 115; i++) {
    const company = companies[i % companies.length];
    const titleBase = titles[i % titles.length];
    const title = `${titleBase} - ${company.split(' ')[0]}`;
    
    if (internshipTitles.has(title)) continue;
    internshipTitles.add(title);

    const skillsNeeded = [];
    for (let j = 0; j < 3 + Math.floor(Math.random() * 4); j++) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      if (!skillsNeeded.includes(skill)) skillsNeeded.push(skill);
    }

    const stipend = 5000 + Math.floor(Math.random() * 16) * 1000;
    const daysFromNow = 15 + Math.floor(Math.random() * 45);
    const deadline = new Date(new Date().setDate(new Date().getDate() + daysFromNow)).toISOString().split('T')[0];

    internships.push({
      id: i + 1,
      title,
      company,
      duration: `${2 + Math.floor(Math.random() * 5)} Months`,
      location: locations[Math.floor(Math.random() * locations.length)],
      stipend: `₹${stipend.toLocaleString()}/month`,
      description: `Join ${company} and work on exciting ${titleBase.toLowerCase()} projects. You'll gain hands-on experience with modern technologies and collaborate with experienced professionals in a dynamic environment.`,
      skills: skillsNeeded,
      type: Math.random() > 0.3 ? 'Full-time' : 'Part-time',
      applicants: Math.floor(Math.random() * 150),
      deadline,
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
      createdAt: new Date().toISOString()
    });
  }

  return internships.slice(0, 115);
};

const generateUsers = () => {
  const firstNames = [
    'Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Sneha', 'Rohit', 'Divya', 'Arjun', 'Ananya',
    'Karan', 'Ayush', 'Simran', 'Nikhil', 'Pooja', 'Akshay', 'Isha', 'Ravi', 'Meera', 'Harish',
    'Kavya', 'Sanjay', 'Pallavi', 'Arpit', 'Ritika', 'Shreyas', 'Aditi', 'Manish', 'Zara', 'Yash',
    'Tanvi', 'Varun', 'Shreya', 'Naman', 'Disha', 'Abhishek', 'Niya', 'Pranav', 'Akriti', 'Rohan',
    'Seema', 'Anuj', 'Shweta', 'Vivek', 'Radhika', 'Saurav', 'Neeti', 'Tushar', 'Sakshi', 'Mohit',
    'Lalita', 'Chirag', 'Riya', 'Arjun', 'Swati', 'Aman', 'Pooja', 'Rahul', 'Nisha', 'Vipul',
    'Puja', 'Harsh', 'Anjali', 'Sarthak', 'Tanya', 'Deepak', 'Heena', 'Naveen', 'Vidya', 'Sachin',
    'Lavanya', 'Siddharth', 'Swapna', 'Ashok', 'Naina', 'Shantanu', 'Bhavna', 'Nitin', 'Olivia', 'Kabir',
    'Yasmin', 'Suresh', 'Sandhya', 'Vishal', 'Malini', 'Girish', 'Pooja', 'Sourav', 'Kanika', 'Ashish',
    'Shreya', 'Anshul', 'Richa', 'Rajesh', 'Anjali', 'Vinay', 'Namrata', 'Pradeep', 'Kavita', 'Rajeev'
  ];

  const lastNames = [
    'Kumar', 'Singh', 'Patel', 'Sharma', 'Verma', 'Reddy', 'Gupta', 'Rao', 'Malhotra', 'Mishra',
    'Chopra', 'Nair', 'Iyer', 'Bhat', 'Pandey', 'Joshi', 'Kapoor', 'Bose', 'Roy', 'Dasgupta',
    'Kulkarni', 'Rao', 'Pillai', 'Menon', 'Saxena', 'Tripathi', 'Dubey', 'Shukla', 'Tiwari', 'Lamba'
  ];

  const colleges = [
    'Delhi University', 'Mumbai University', 'Bangalore Institute of Technology', 'IIT Delhi',
    'IIT Mumbai', 'IIT Bangalore', 'Punjab University', 'Anna University', 'Gujarat University',
    'Jadavpur University', 'VIT Vellore', 'Manipal Academy', 'BITS Pilani', 'Amrita Vishwa Vidyapeetham',
    'SRM Institute', 'Chandigarh University', 'Nirma University', 'OP Jindal University',
    'Lovely Professional University', 'Symbiosis Institute', 'Trinity College', 'St. Stephens College',
    'Miranda House', 'Delhi School of Economics', 'Christ University', 'Ashoka University'
  ];

  const branches = [
    'Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering',
    'Mechanical Engineering', 'Data Science', 'Artificial Intelligence', 'Business Analytics', 'BCA', 'B.Tech'
  ];

  const users = [];

  for (let i = 1; i <= 110; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const username = `student-${i}`;
    const email = `student${i}@internhub.com`;

    users.push({
      id: `user-${i}`,
      username,
      email,
      password: 'password123',
      fullName,
      role: 'student',
      college: colleges[Math.floor(Math.random() * colleges.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      isAdmin: false,
      createdAt: new Date().toISOString()
    });
  }

  // Add admin user
  users.push({
    id: 'admin-1',
    username: 'admin',
    email: 'admin@internhub.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
    college: 'Admin',
    branch: 'Administration',
    isAdmin: true,
    createdAt: new Date().toISOString()
  });

  return users;
};

// Initialize localStorage with comprehensive demo data
const initializeLocalStorage = () => {
  if (!localStorage.getItem('internships')) {
    localStorage.setItem('internships', JSON.stringify(generateInternships()));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(generateUsers()));
  }
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }
};

// ===== USER API =====
export const userAPI = {
  register: async (username, email, password, fullName, college, branch) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.username === username || u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      fullName,
      college,
      branch,
      role: 'student',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },

  login: async (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return user;
  },

  getAllUsers: async () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  getUserById: async (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId);
  },

  updateUser: async (userId, updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    return users[index];
  },

  deleteUser: async (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filtered));
  }
};

// ===== INTERNSHIP API =====
export const internshipAPI = {
  getAll: async () => {
    initializeLocalStorage();
    return JSON.parse(localStorage.getItem('internships') || '[]');
  },

  getById: async (internshipId) => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    return internships.find(i => i.id === internshipId);
  },

  create: async (internshipData) => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const newInternship = {
      id: Math.max(...internships.map(i => i.id || 0), 0) + 1,
      ...internshipData,
      createdAt: new Date().toISOString(),
      applicants: 0
    };
    internships.push(newInternship);
    localStorage.setItem('internships', JSON.stringify(internships));
    return newInternship;
  },

  update: async (internshipId, updates) => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const index = internships.findIndex(i => i.id === internshipId);
    if (index === -1) throw new Error('Internship not found');
    
    internships[index] = { ...internships[index], ...updates };
    localStorage.setItem('internships', JSON.stringify(internships));
    return internships[index];
  },

  delete: async (internshipId) => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const filtered = internships.filter(i => i.id !== internshipId);
    localStorage.setItem('internships', JSON.stringify(filtered));
  },

  search: async (query) => {
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const lowerQuery = query.toLowerCase();
    return internships.filter(i =>
      i.title.toLowerCase().includes(lowerQuery) ||
      i.company.toLowerCase().includes(lowerQuery) ||
      i.skills.some(s => s.toLowerCase().includes(lowerQuery))
    );
  }
};

// ===== APPLICATION API =====
export const applicationAPI = {
  create: async (userId, internshipId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    if (applications.find(a => a.userId === userId && a.internshipId === internshipId)) {
      throw new Error('Already applied');
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      userId,
      internshipId,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      tasks: [],
      progress: 0,
      adminFeedback: '',
      evaluation: 'Not Evaluated'
    };

    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Increment applicants count
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    const index = internships.findIndex(i => i.id === internshipId);
    if (index !== -1) {
      internships[index].applicants = (internships[index].applicants || 0) + 1;
      localStorage.setItem('internships', JSON.stringify(internships));
    }

    return newApplication;
  },

  getByUserId: async (userId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    return applications.filter(a => a.userId === userId);
  },

  getAll: async () => {
    return JSON.parse(localStorage.getItem('applications') || '[]');
  },

  updateStatus: async (applicationId, status) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const index = applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');
    
    applications[index].status = status;
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[index];
  },

  addFeedback: async (applicationId, feedback, evaluation) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const index = applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');
    
    applications[index].adminFeedback = feedback;
    applications[index].evaluation = evaluation;
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[index];
  },

  delete: async (applicationId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const filtered = applications.filter(a => a.id !== applicationId);
    localStorage.setItem('applications', JSON.stringify(filtered));
  }
};

// ===== TASK API =====
export const taskAPI = {
  create: async (applicationId, taskData) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const index = applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');

    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    applications[index].tasks = applications[index].tasks || [];
    applications[index].tasks.push(newTask);
    localStorage.setItem('applications', JSON.stringify(applications));
    return newTask;
  },

  getByApplicationId: async (applicationId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const app = applications.find(a => a.id === applicationId);
    return app?.tasks || [];
  },

  update: async (applicationId, taskId, updates) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    const taskIndex = applications[appIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    applications[appIndex].tasks[taskIndex] = {
      ...applications[appIndex].tasks[taskIndex],
      ...updates
    };
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[appIndex].tasks[taskIndex];
  },

  delete: async (applicationId, taskId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    applications[appIndex].tasks = (applications[appIndex].tasks || []).filter(t => t.id !== taskId);
    localStorage.setItem('applications', JSON.stringify(applications));
  }
};

// ===== SUBMISSION API =====
export const submissionAPI = {
  create: async (applicationId, submissionData) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const index = applications.findIndex(a => a.id === applicationId);
    if (index === -1) throw new Error('Application not found');

    const newSubmission = {
      id: `submission-${Date.now()}`,
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };

    applications[index].submissions = applications[index].submissions || [];
    applications[index].submissions.push(newSubmission);
    localStorage.setItem('applications', JSON.stringify(applications));
    return newSubmission;
  },

  getByApplicationId: async (applicationId) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const app = applications.find(a => a.id === applicationId);
    return app?.submissions || [];
  },

  getAll: async () => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const allSubmissions = [];
    applications.forEach(app => {
      if (app.submissions) allSubmissions.push(...app.submissions);
    });
    return allSubmissions;
  },

  updateStatus: async (applicationId, submissionId, status) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    const subIndex = (applications[appIndex].submissions || []).findIndex(s => s.id === submissionId);
    if (subIndex === -1) throw new Error('Submission not found');

    applications[appIndex].submissions[subIndex].status = status;
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[appIndex].submissions[subIndex];
  }
};

// Initialize on load
initializeLocalStorage();

// Export init function for context
export { initializeLocalStorage };
