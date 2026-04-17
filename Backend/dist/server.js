"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
async function main() {
    await mongoose_1.default.connect(process.env.DATABASE_URL);
    app_1.default.listen(process.env.PORT || 3000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
}
main().catch((err) => console.log(err));
//# sourceMappingURL=server.js.map