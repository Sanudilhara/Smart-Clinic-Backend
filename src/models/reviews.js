import { DataTypes } from "sequelize";

export default (sequelize) => {
  const reviews = sequelize.define("reviews", {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
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
  }, {
    tableName: "reviews",
    timestamps: false,
  });

  // Associations
  reviews.associate = (models) => {
    reviews.belongsTo(models.patients, {  
      foreignKey: "patient_id",
      as: "patient",
    }); 
    reviews.belongsTo(models.doctors, {
      foreignKey: "doctor_id",
      as: "doctor",
    });
  };

  return reviews;
};