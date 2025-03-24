const { sequelize } = require('../config/db');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Clear existing data

        // Create users
        const users = await User.bulkCreate([
            {
                name: 'John Admin',
                email: 'admin@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'admin',
                department: 'Administration'
            },
            {
                name: 'Sarah Manager',
                email: 'manager@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'manager',
                department: 'HR'
            },
            {
                name: 'Mike Employee',
                email: 'employee1@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'employee',
                department: 'Engineering'
            },
            {
                name: 'Lisa Employee',
                email: 'employee2@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'employee',
                department: 'Marketing'
            }
        ]);

        // Create leave requests
        await LeaveRequest.bulkCreate([
            {
                userId: users[2].id, // Mike's leave request
                leaveType: 'annual',
                startDate: new Date('2024-04-01'),
                endDate: new Date('2024-04-05'),
                reason: 'Family vacation',
                status: 'approved',
                approvedById: users[1].id, // Approved by Sarah
                approvalDate: new Date('2024-03-15')
            },
            {
                userId: users[3].id, // Lisa's leave request
                leaveType: 'sick',
                startDate: new Date('2024-03-25'),
                endDate: new Date('2024-03-26'),
                reason: 'Doctor appointment',
                status: 'pending'
            },
            {
                userId: users[2].id, // Mike's another leave request
                leaveType: 'personal',
                startDate: new Date('2024-05-15'),
                endDate: new Date('2024-05-15'),
                reason: 'Personal errands',
                status: 'rejected',
                approvedById: users[1].id, // Rejected by Sarah
                approvalDate: new Date('2024-03-20')
            }
        ]);

        console.log('Sample data has been inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close();
    }
};

seedData();