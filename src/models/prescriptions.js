import { DataTypes } from "sequelize";

export default (sequelize) => {
  const prescriptions = sequelize.define(
    "prescriptions",
    {
      prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      medicine_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      instruction: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      additional_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "prescriptions",
      timestamps: false,
    }
  );

  prescriptions.associate = (models) => {
    prescriptions.belongsTo(models.appointments, {
      foreignKey: "appointment_id",
      as: "appointment",
    });
  };

  return prescriptions;
};