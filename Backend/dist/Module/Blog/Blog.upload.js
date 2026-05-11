"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpload = void 0;
const multer_1 = require("../../config/multer");
exports.blogUpload = multer_1.upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "sectionImages", maxCount: 10 },
]);
//# sourceMappingURL=Blog.upload.js.map