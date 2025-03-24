const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { auth, authManager } = require('../middleware/auth');

// Submit a leave request
router.post('/', auth, async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all leave requests (managers/admin only)
router.get('/all', auth, authManager, async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'department']
                },
                {
                    model: User,
                    as: 'approvedBy',
                    attributes: ['name']
                }
            ]
        });
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get my leave requests
router.get('/my-requests', auth, async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.findAll({
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: 'approvedBy',
                attributes: ['name']
            }]
        });
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get pending leave requests (managers/admin only)
router.get('/pending', auth, authManager, async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.findAll({
            where: { status: 'pending' },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'department']
            }]
        });
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve/Reject leave request (managers/admin only)
router.patch('/:id/status', auth, authManager, async (req, res) => {
    try {
        const { status, approvalComments } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const leaveRequest = await LeaveRequest.findByPk(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        leaveRequest.status = status;
        leaveRequest.approvalComments = approvalComments;
        leaveRequest.approvedById = req.user.id;
        leaveRequest.approvalDate = new Date();

        await leaveRequest.save();
        res.json(leaveRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete leave request (only if pending)
router.delete('/:id', auth, async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
                status: 'pending'
            }
        });

        if (!leaveRequest) {
            return res.status(404).json({ 
                error: 'Leave request not found or cannot be deleted' 
            });
        }

        await leaveRequest.destroy();
        res.json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;