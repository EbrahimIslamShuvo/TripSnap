"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const User_route_1 = require("./Module/User/User.route");
const path_1 = __importDefault(require("path"));
const Place_route_1 = require("./Module/Place/Place.route");
const Blog_route_1 = require("./Module/Blog/Blog.route");
const Activity_route_1 = __importDefault(require("./Module/Activity/Activity.route"));
const Comment_route_1 = require("./Module/Comment/Comment.route");
const Payment_route_1 = require("./Module/Payment/Payment.route");
const Message_route_1 = require("./Module/Message/Message.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/users", User_route_1.UserRoutes);
app.use("/api/places", Place_route_1.PlaceRoutes);
app.use("/api/blogs", Blog_route_1.BlogRoutes);
app.use("/api", Activity_route_1.default);
app.use("/api/comments", Comment_route_1.CommentRoutes);
app.use("/api/payment", Payment_route_1.PaymentRoute);
app.use("/api/messages", Message_route_1.MessageRoutes);
exports.default = app;
//# sourceMappingURL=app.js.map