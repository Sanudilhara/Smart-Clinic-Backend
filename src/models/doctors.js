import { DataTypes } from "sequelize";

export default (sequelize) => {
    const doctors = sequelize.define(
    "doctors",

        {
            doctor_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {  
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,   
            },
            department_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            doctor_name: {
                type: DataTypes.STRING(100),    
                allowNull: false,
            },
            doctor_fee: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            specialization: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            experience_year: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            bio: {
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
        {
            tableName: "doctors",
            timestamps: false,
        }
    );

    // Associations
    doctors.associate = (models) => {
        doctors.belongsTo(models.users, {   
            foreignKey: "user_id",
            as: "user",
        });
        doctors.belongsTo(models.departments, {
            foreignKey: "department_id",
            as: "department",
        });
    };
    return doctors;
};
