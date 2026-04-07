import { DataTypes } from "sequelize"; // Import DataTypes from Sequelize

// Define the appointments model and its fields
export default (sequelize) => {
  // Define the appointments model with its fields and configurations
  const appointments = sequelize.define(
    "appointments",
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      payment_state: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "unpaid",
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    // Define the table name and disable automatic timestamps
    {
      tableName: "appointments",
      timestamps: false,
    }
  );

  // Define associations with other models
  appointments.associate = (models) => {
    appointments.belongsTo(models.patients, {
      foreignKey: "patient_id",
      as: "patient",
    });
    appointments.belongsTo(models.doctors, {
      foreignKey: "doctor_id",
      as: "doctor",
    });
    appointments.belongsTo(models.schedules, {
      foreignKey: "schedule_id",
      as: "schedule",
    });
  };

  return appointments;
};
