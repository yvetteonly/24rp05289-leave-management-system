const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class LeaveRequest extends Model {}

LeaveRequest.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    leaveType: {
        type: DataTypes.ENUM('annual', 'sick', 'personal', 'maternity', 'paternity'),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfterStartDate(value) {
                if (value < this.startDate) {
                    throw new Error('End date must be after start date');
                }
            }
        }
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approvedById: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    approvalDate: {
        type: DataTypes.DATE
    },
    approvalComments: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'LeaveRequest',
    timestamps: true
});

module.exports = LeaveRequest;