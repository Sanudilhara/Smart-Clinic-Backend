import { DataTypes } from "sequelize";

export default (sequelize) => {
    const users = sequelize.define(
        "users",
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            user_email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_contact: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            tableName: "users",
            timestamps: false,
        }
    );

    // Associations
    users.associate = (models) => {
        users.hasOne(models.doctors, {
            foreignKey: "user_id",
            as: "doctor",
        });
    users.hasOne(models.patients, {
            foreignKey: "user_id",
            as: "patient",  
        });
    };

    return users;
};