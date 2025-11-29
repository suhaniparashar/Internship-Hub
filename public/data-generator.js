/**
 * InternHub - Comprehensive Data Generator
 * Generates realistic sample data for 20 users per day for the last 30 days
 * Total: ~600 users with applications, tasks, and activity logs
 */

class InternHubDataGenerator {
    constructor() {
        this.users = [];
        this.internships = this.generateInternships();
        this.applications = [];
        this.tasks = [];
        this.activityLogs = [];
        this.startDate = this.getDateDaysAgo(30);
    }

    /**
     * Get date from N days ago
     */
    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    /**
     * Format date to YYYY-MM-DD
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate random email
     */
    generateEmail(firstName, lastName, index) {
        const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com', 'icloud.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`;
    }

    /**
     * Generate random names
     */
    generateName() {
        const firstNames = [
            'Aditya', 'Priya', 'Rohit', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Divya',
            'Karan', 'Sneha', 'Ravi', 'Shreya', 'Sanjay', 'Pooja', 'Nikhil', 'Isha',
            'Akshay', 'Diya', 'Varun', 'Ritika', 'Suhani', 'Aryan', 'Zara', 'Sameer',
            'Anu', 'Rohan', 'Pallavi', 'Harsh', 'Megha', 'Abhishek'
        ];

        const lastNames = [
            'Kumar', 'Singh', 'Patel', 'Verma', 'Sharma', 'Desai', 'Nair', 'Gupta',
            'Chopra', 'Iyer', 'Menon', 'Reddy', 'Rao', 'Sinha', 'Bhat', 'Pillai',
            'Parashar', 'Kapoor', 'Malhotra', 'Banerjee', 'Roy', 'Das', 'Dutta', 'Mishra'
        ];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return { firstName, lastName, fullName: `${firstName} ${lastName}` };
    }

    /**
     * Generate colleges
     */
    generateCollege() {
        const colleges = [
            'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kharagpur', 'IIT Roorkee',
            'NIT Bangalore', 'NIT Trichy', 'NIT Rourkela', 'NIT Surat', 'NIT Warangal',
            'BITS Pilani', 'Manipal University', 'VIT Vellore', 'MIT Pune', 'KL University',
            'SRM University', 'Amrita Vishwa Vidyapeetham', 'Shiv Nadar University',
            'Delhi University', 'Mumbai University', 'Bangalore University', 'Chennai University'
        ];
        return colleges[Math.floor(Math.random() * colleges.length)];
    }

    /**
     * Generate branches
     */
    generateBranch() {
        const branches = [
            'Computer Science', 'Information Technology', 'Electronics & Communication',
            'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
            'Biotechnology', 'Chemical Engineering', 'Data Science', 'Artificial Intelligence'
        ];
        return branches[Math.floor(Math.random() * branches.length)];
    }

    /**
     * Generate internships
     */
    generateInternships() {
        const companies = [
            'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Oracle', 'Cisco',
            'Infosys', 'TCS', 'Wipro', 'HCL Technologies', 'Accenture', 'Deloitte',
            'McKinsey', 'Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'Uber',
            'Airbnb', 'Netflix', 'Spotify', 'Dropbox', 'Slack', 'Shopify', 'Stripe'
        ];

        const roles = [
            'Frontend Developer', 'Backend Engineer', 'Full Stack Developer',
            'Data Scientist', 'Data Analyst', 'Machine Learning Engineer',
            'DevOps Engineer', 'QA Engineer', 'Product Manager', 'UI/UX Designer',
            'Business Analyst', 'Cloud Engineer', 'Security Engineer', 'Systems Engineer'
        ];

        const locations = [
            'Remote', 'Bangalore', 'Hyderabad', 'Delhi', 'Pune', 'Mumbai',
            'Chennai', 'Kolkata', 'Ahmedabad', 'Chandigarh', 'Gurgaon', 'Noida'
        ];

        const internships = [];
        for (let i = 0; i < companies.length; i++) {
            internships.push({
                id: `INT${String(i + 1).padStart(3, '0')}`,
                company: companies[i],
                role: roles[Math.floor(Math.random() * roles.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                stipend: Math.floor(Math.random() * (30 - 14 + 1) + 14) * 1000,
                duration: [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)],
                type: Math.random() > 0.3 ? 'Full-time' : 'Part-time',
                postedDate: this.formatDate(this.getDateDaysAgo(Math.floor(Math.random() * 30))),
                applicantsCount: Math.floor(Math.random() * (3500 - 500 + 1) + 500),
                rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1)
            });
        }
        return internships;
    }

    /**
     * Generate users for a specific date
     */
    generateUsersForDate(dateStr, count = 20) {
        const usersForDate = [];
        for (let i = 0; i < count; i++) {
            const { firstName, lastName, fullName } = this.generateName();
            const index = this.users.length + i;
            const user = {
                id: `USR${String(index + 1).padStart(5, '0')}`,
                name: fullName,
                firstName,
                lastName,
                email: this.generateEmail(firstName, lastName, index),
                phone: `+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
                college: this.generateCollege(),
                branch: this.generateBranch(),
                gpa: (Math.random() * (4 - 2.5) + 2.5).toFixed(2),
                registrationDate: dateStr,
                profileCompletion: Math.floor(Math.random() * 100),
                status: Math.random() > 0.1 ? 'active' : 'inactive',
                role: 'student'
            };
            usersForDate.push(user);
        }
        return usersForDate;
    }

    /**
     * Generate all users (20 per day for 30 days)
     */
    generateAllUsers() {
        for (let day = 0; day < 30; day++) {
            const date = new Date(this.startDate);
            date.setDate(date.getDate() + day);
            const dateStr = this.formatDate(date);
            const usersForDay = this.generateUsersForDate(dateStr, 20);
            this.users.push(...usersForDay);
        }
        return this.users;
    }

    /**
     * Generate applications for users
     */
    generateApplications() {
        this.users.forEach(user => {
            // Each user applies to 1-8 internships
            const numApplications = Math.floor(Math.random() * 8) + 1;
            const appliedInternships = new Set();

            for (let i = 0; i < numApplications; i++) {
                let randomInternship;
                do {
                    randomInternship = this.internships[Math.floor(Math.random() * this.internships.length)];
                } while (appliedInternships.has(randomInternship.id));

                appliedInternships.add(randomInternship.id);

                const applicationDate = new Date(user.registrationDate);
                applicationDate.setDate(applicationDate.getDate() + Math.floor(Math.random() * 10));

                const statuses = ['pending', 'accepted', 'rejected', 'interview', 'offer'];
                const statusWeights = [0.4, 0.2, 0.2, 0.15, 0.05]; // More pending than others
                let rand = Math.random();
                let status = 'pending';
                let cumWeight = 0;
                for (let j = 0; j < statuses.length; j++) {
                    cumWeight += statusWeights[j];
                    if (rand <= cumWeight) {
                        status = statuses[j];
                        break;
                    }
                }

                this.applications.push({
                    id: `APP${String(this.applications.length + 1).padStart(5, '0')}`,
                    userId: user.id,
                    userName: user.name,
                    internshipId: randomInternship.id,
                    company: randomInternship.company,
                    role: randomInternship.role,
                    status,
                    appliedDate: this.formatDate(applicationDate),
                    lastUpdated: this.formatDate(new Date()),
                    interviewDate: status === 'interview' || status === 'offer' ? 
                        this.formatDate(new Date(applicationDate.getTime() + 7 * 24 * 60 * 60 * 1000)) : null,
                    result: status === 'accepted' ? 'Selected' : status === 'rejected' ? 'Rejected' : 
                           status === 'offer' ? 'Offer' : null
                });
            }
        });
        return this.applications;
    }

    /**
     * Generate tasks for users
     */
    generateTasks() {
        const taskTypes = [
            'Update Resume',
            'Complete Profile',
            'Prepare for Interview',
            'Submit Assignment',
            'Attend Webinar',
            'Record Video Introduction',
            'Complete Assessment',
            'Submit Portfolio',
            'Write Cover Letter'
        ];

        this.users.forEach((user, index) => {
            const numTasks = Math.floor(Math.random() * 5) + 2;
            for (let i = 0; i < numTasks; i++) {
                const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));

                const statuses = ['pending', 'in-progress', 'completed'];
                const priorities = ['low', 'medium', 'high'];

                this.tasks.push({
                    id: `TSK${String(this.tasks.length + 1).padStart(5, '0')}`,
                    userId: user.id,
                    userName: user.name,
                    title: taskType,
                    description: `${taskType} for career development`,
                    priority: priorities[Math.floor(Math.random() * priorities.length)],
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    createdDate: this.formatDate(new Date(user.registrationDate)),
                    dueDate: this.formatDate(dueDate),
                    category: 'profile-enhancement'
                });
            }
        });
        return this.tasks;
    }

    /**
     * Generate activity logs
     */
    generateActivityLogs() {
        const activityTypes = [
            'Profile Updated',
            'Application Submitted',
            'Profile Viewed',
            'Internship Saved',
            'Resume Uploaded',
            'Interview Scheduled',
            'Message Received',
            'Offer Received'
        ];

        this.users.forEach(user => {
            const numActivities = Math.floor(Math.random() * 20) + 5;
            const userRegDate = new Date(user.registrationDate);

            for (let i = 0; i < numActivities; i++) {
                const logDate = new Date(userRegDate);
                logDate.setDate(logDate.getDate() + Math.floor(Math.random() * 30));
                logDate.setHours(Math.floor(Math.random() * 24));
                logDate.setMinutes(Math.floor(Math.random() * 60));

                this.activityLogs.push({
                    id: `ACT${String(this.activityLogs.length + 1).padStart(6, '0')}`,
                    userId: user.id,
                    userName: user.name,
                    activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
                    timestamp: logDate.toISOString(),
                    details: `User activity: ${user.name}`,
                    ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
                });
            }
        });
        return this.activityLogs;
    }

    /**
     * Generate all data
     */
    generateAll() {
        console.log('📊 Generating InternHub Sample Data...');
        console.log('⏳ This may take a moment...\n');

        const startTime = performance.now();

        this.generateAllUsers();
        console.log(`✅ Generated ${this.users.length} users`);

        this.generateApplications();
        console.log(`✅ Generated ${this.applications.length} applications`);

        this.generateTasks();
        console.log(`✅ Generated ${this.tasks.length} tasks`);

        this.generateActivityLogs();
        console.log(`✅ Generated ${this.activityLogs.length} activity logs`);

        const endTime = performance.now();
        console.log(`\n⏱️  Total generation time: ${((endTime - startTime) / 1000).toFixed(2)}s\n`);

        return {
            users: this.users,
            internships: this.internships,
            applications: this.applications,
            tasks: this.tasks,
            activityLogs: this.activityLogs,
            summary: {
                totalUsers: this.users.length,
                totalInternships: this.internships.length,
                totalApplications: this.applications.length,
                totalTasks: this.tasks.length,
                totalActivityLogs: this.activityLogs.length,
                generatedAt: new Date().toISOString()
            }
        };
    }

    /**
     * Export data to JSON
     */
    exportToJSON() {
        return JSON.stringify(this.generateAll(), null, 2);
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const stats = {
            usersPerDay: 20,
            totalDays: 30,
            totalUsers: this.users.length,
            totalInternships: this.internships.length,
            totalApplications: this.applications.length,
            avgApplicationsPerUser: (this.applications.length / this.users.length).toFixed(2),
            acceptanceRate: ((this.applications.filter(a => a.status === 'accepted').length / this.applications.length) * 100).toFixed(2),
            pendingApplications: this.applications.filter(a => a.status === 'pending').length,
            interviewScheduled: this.applications.filter(a => a.status === 'interview').length,
            offersExtended: this.applications.filter(a => a.status === 'offer').length,
            topCompanies: this.getTopCompanies(),
            topRoles: this.getTopRoles()
        };
        return stats;
    }

    /**
     * Get top companies by applications
     */
    getTopCompanies() {
        const companyStats = {};
        this.applications.forEach(app => {
            companyStats[app.company] = (companyStats[app.company] || 0) + 1;
        });
        return Object.entries(companyStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([company, count]) => ({ company, applications: count }));
    }

    /**
     * Get top roles by applications
     */
    getTopRoles() {
        const roleStats = {};
        this.applications.forEach(app => {
            roleStats[app.role] = (roleStats[app.role] || 0) + 1;
        });
        return Object.entries(roleStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([role, count]) => ({ role, applications: count }));
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternHubDataGenerator;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.InternHubDataGenerator = InternHubDataGenerator;
}

/**
 * Usage Examples:
 * 
 * // In Node.js:
 * const DataGenerator = require('./data-generator.js');
 * const generator = new DataGenerator();
 * const data = generator.generateAll();
 * console.log(data);
 * 
 * // In Browser:
 * const generator = new InternHubDataGenerator();
 * const data = generator.generateAll();
 * const stats = generator.getStatistics();
 * console.log(stats);
 * 
 * // Export to JSON file (Node.js):
 * const fs = require('fs');
 * const generator = new DataGenerator();
 * const data = generator.generateAll();
 * fs.writeFileSync('sample-data.json', JSON.stringify(data, null, 2));
 */
