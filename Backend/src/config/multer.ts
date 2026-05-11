import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/";

// AUTO CREATE FOLDER
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({

  destination: (
    req,
    file,
    cb
  ) => {

    cb(null, uploadPath);
  },

  filename: (
    req,
    file,
    cb
  ) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1e9
      ) +
      path.extname(
        file.originalname
      );

    cb(null, uniqueName);
  },
});

export const upload =
  multer({
    storage,
  });