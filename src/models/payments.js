import { DataTypes } from "sequelize";

export default (sequelize) => {
    const payments = sequelize.define(
        "payments",
        {
            payment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            payment_status: {
                type: DataTypes.ENUM("pending", "paid", "failed"),
                defaultValue: "paid",
            },
            paid_at: {  
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
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
            tableName: "payments",
            timestamps: false,
        }
    );

    // Associations
    payments.associate = (models) => {
        payments.belongsTo(models.appointments, {
            foreignKey: "appointment_id",
            as: "appointment",
        });
    };

    return payments;
};