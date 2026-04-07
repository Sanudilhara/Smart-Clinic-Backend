import { DataTypes } from "sequelize";

export default (sequelize) => {
    const medical_records = sequelize.define(
        "medical_records",
        {
            record_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            diagnosis: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            report: {
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
            tableName: "medical_records",
            timestamps: false,
        }
    );

    // Associations
    medical_records.associate = (models) => {
        medical_records.belongsTo(models.appointments, {
            foreignKey: "appointment_id",
            as: "appointment",
        });
    };

    return medical_records;
};
