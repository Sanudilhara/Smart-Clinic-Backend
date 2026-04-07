import { DataTypes } from "sequelize"

export default (sequelize) => { 
const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: false
})

// Associations
Role.associate = (models) => {
  Role.hasMany(models.users, {
    foreignKey: "role_id",
    as: "users"
  });
};

return Role
}