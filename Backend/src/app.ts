import express, { Application } from "express";
import cors from "cors";
import { UserRoutes } from "./Module/User/User.route";
import path from "path";
import { PlaceRoutes } from "./Module/Place/Place.route";
import { BlogRoutes } from "./Module/Blog/Blog.route";
import activityRoutes from "./Module/Activity/Activity.route";
import { CommentRoutes } from "./Module/Comment/Comment.route";
import { PaymentRoute } from "./Module/Payment/Payment.route";
import { MessageRoutes } from "./Module/Message/Message.route";
import { TourRoutes } from "./Module/Tour/Tour.route";
import { BookingRoutes } from "./Module/Booking/Booking.route";


const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", UserRoutes);
app.use("/api/places", PlaceRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api", activityRoutes);
app.use("/api/comments", CommentRoutes);
app.use(
  "/api/payment",
  PaymentRoute
);

app.use(
  "/api/messages",
  MessageRoutes
);

app.use("/api/tours", TourRoutes);
app.use(
  "/api/bookings",
  BookingRoutes
);

export default app;