import express, { Application } from "express";
import cors from "cors";
import { UserRoutes } from "./Module/User/User.route";
import path from "path";
import { PlaceRoutes } from "./Module/Place/Place.route";


const app:Application = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", UserRoutes);
app.use("/api/places", PlaceRoutes);

export default app;