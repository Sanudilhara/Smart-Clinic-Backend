import { DataTypes } from "sequelize";

export default (sequelize) => {
  const departments = sequelize.define(
    "departments",
    {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      department_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "departments",
      timestamps: false,
    }
  );

  // Associations 
  departments.associate = (models) => {
    departments.hasMany(models.doctors, {
      foreignKey: "department_id",
      as: "doctors",
    });
  };

  return departments;
};
