import express from "express";
import cors from "cors";

import usersRoute from "./routes/usersRoute.js";
import roomsRoute from "./routes/roomsRoute.js";
import schedulesRoute from "./routes/schedulesRoute.js";
import departmentsRoute from "./routes/departmentsRoute.js";
import reviewsRoute from "./routes/reviewsRoute.js";
import notificationsRoute from "./routes/notificationsRoutes.js";
import patientRoute from "./routes/patientRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import authRoute from "./routes/authRoute.js";
import medicalRecordsRoute from "./routes/medicalRecordsRoute.js";
import prescriptionsRoute from "./routes/prescriptionsRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/schedules", schedulesRoute);
app.use("/api/departments", departmentsRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/patients", patientRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/auth", authRoute);
app.use("/api/medical-records", medicalRecordsRoute);
app.use("/api/prescriptions", prescriptionsRoute);
app.use("/api/payments", paymentRoute);

export default app;