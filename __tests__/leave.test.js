const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize } = require('../src/config/db');
const authRoutes = require('../src/routes/auth');
const leaveRoutes = require('../src/routes/leave');
const LeaveRequest = require('../src/models/LeaveRequest');
const User = require('../src/models/User');

let app;
let server;

describe('Leave Request API Endpoints', () => {
  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/leave', leaveRoutes);
    await connectDB();
    return new Promise(resolve => {
      server = app.listen(3001, resolve);
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true }); // Reset database
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 500)); // Ensure all connections are properly closed
  });
  describe('GET /api/leave', () => {
    it('should return all leave requests', async () => {
      const res = await request(app).get('/api/leave');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should handle errors', async () => {
      jest.spyOn(LeaveRequest, 'findAll').mockRejectedValueOnce(new Error('Database error'));
      const res = await request(app).get('/api/leave');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('POST /api/leave', () => {
    const newLeave = {
      userId: 1,
      leaveType: 'annual',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      reason: 'Vacation'
    };

    let token;
    beforeEach(async () => {
      await LeaveRequest.destroy({ where: {} }); // Clean up before each test
      await User.destroy({ where: {} }); // Clean up before each test
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee',
        department: 'Testing'
      });
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key');
    });

    it('should create a new leave request', async () => {
      const res = await request(app)
        .post('/api/leave')
        .set('Authorization', `Bearer ${token}`)
        .send(newLeave);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('should handle errors during leave request creation', async () => {
      jest.spyOn(LeaveRequest, 'create').mockRejectedValueOnce(new Error('Validation error'));
      const res = await request(app)
        .post('/api/leave')
        .set('Authorization', `Bearer ${token}`)
        .send(newLeave);
      expect(res.statusCode).toBe(400);
    });
  });
});