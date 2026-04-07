import { DataTypes } from "sequelize";

export default (sequelize) => {
  const schedules = sequelize.define(
    "schedules",
    {
      schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "available",
      },
      max_patient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    {
      tableName: "schedules",
      timestamps: false,
    }
  );

  // Associations
  schedules.associate = (models) => {
    schedules.belongsTo(models.doctors, {
      foreignKey: "doctor_id",
      as: "doctor",
    });
    schedules.hasMany(models.appointments, {
      foreignKey: "schedule_id",
      as: "appointments",
    });
  };

  return schedules;
};