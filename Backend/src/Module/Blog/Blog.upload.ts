import { upload } from "../../config/multer";

export const blogUpload = upload.fields([
  { name: "banner", maxCount: 1 },        
  { name: "gallery", maxCount: 10 },     
  { name: "sectionImages", maxCount: 10 }, 
]);