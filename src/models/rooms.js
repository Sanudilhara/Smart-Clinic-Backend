import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const rooms = sequelize.define(
        "rooms",
        {
            room_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            room_no: {
                type: DataTypes.STRING(20), 
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'available',
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
            tableName: "rooms",
            timestamps: false,
        }
    );

    // Associations
    rooms.associate = (models) => {
        rooms.belongsTo(models.doctors, {
            foreignKey: "doctor_id",
            as: "doctor",
        });
    };
    return rooms;

};