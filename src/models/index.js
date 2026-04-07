// Import necessary modules and models
import { sequelize } from "../config/db.js";
import usersModel from "./users.js";
import departmentsModel from "./departments.js";
import paymentsModel from "./payments.js";
import roomsModel from "./rooms.js";
import schedulesModel from "./schedules.js";
import appointmentsModel from "./appointments.js";
import doctorsModel from "./doctors.js";
import reviewsModel from "./reviews.js";
import notificationsModel from "./notifications.js";
import patientsModel from "./patients.js";
import prescriptionsModel from "./prescriptions.js";
import medicalRecordsModel from "./medical_records.js";
import rolesModel from "./roles.js";

// Initialize models and set up associations
const User = sequelize.models.users || usersModel(sequelize);
const Department = sequelize.models.departments || departmentsModel(sequelize);
const Payment = sequelize.models.payments || paymentsModel(sequelize);
const Room = sequelize.models.rooms || roomsModel(sequelize);
const Schedule = sequelize.models.schedules || schedulesModel(sequelize);
const Appointment = sequelize.models.appointments || appointmentsModel(sequelize);
const Doctor = sequelize.models.doctors || doctorsModel(sequelize);
const Review = sequelize.models.reviews || reviewsModel(sequelize);
const Notification = sequelize.models.notifications || notificationsModel(sequelize);
const Patient = sequelize.models.patients || patientsModel(sequelize);
const Prescription = sequelize.models.prescriptions || prescriptionsModel(sequelize);
const MedicalRecord = sequelize.models.medical_records || medicalRecordsModel(sequelize);
const Role = sequelize.models.Role || rolesModel(sequelize);

// Create a database object to hold all models and the Sequelize instance
const db = {
  sequelize,
  User,
  users: User,
  Department,
  departments: Department,
  Payment,
  payments: Payment,
  Room,
  rooms: Room,
  Schedule,
  schedules: Schedule,
  Appointment,
  appointments: Appointment,
  Doctor,
  doctors: Doctor,
  Review,
  reviews: Review,
  Notification,
  notifications: Notification,
  Patient,
  patients: Patient,
  Prescription,
  prescriptions: Prescription,
  MedicalRecord,
  medical_records: MedicalRecord,
  Role,
  roles: Role,
};

// Set up model associations
const uniqueModels = [...new Set(Object.values(db))];

// Loop through each unique model and call its associate method if it exists
uniqueModels.forEach((model) => {
  if (model && typeof model.associate === "function") {
    model.associate(db);
  }
});

export default db;
