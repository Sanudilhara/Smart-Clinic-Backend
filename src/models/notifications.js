import { DataTypes } from "sequelize";

export default (sequelize) => {
    const notifications = sequelize.define(
        "notifications",
        {
            notification_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {    
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            tableName: "notifications",
            timestamps: false,
        }
    );

    // Associations
    notifications.associate = (models) => {
        notifications.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user",
        });
    };

    return notifications;
};