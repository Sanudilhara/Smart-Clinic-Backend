import { DataTypes } from "sequelize";  

export default (sequelize) =>{
    const patients = sequelize.define(
    "patients",
    {
       patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(20),
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
    {
        tableName: "patients",
        timestamps: false,
    }
    );

    // Associations
    patients.associate = (models) => {
        patients.belongsTo(models.users, {
            foreignKey: "user_id",  
            as: "user",
        });
        patients.hasMany(models.appointments, {
            foreignKey: "patient_id",
            as: "appointments",
        });
    };
    return patients;
};