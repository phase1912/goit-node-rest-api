import multer from "multer";
import path from "path";
import fs from "fs/promises";

const tempDir = path.join(process.cwd(), "temp");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdir(tempDir, { recursive: true })
      .then(() => cb(null, tempDir))
      .catch(cb);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

const uploadAvatar = multer({ storage });

export default uploadAvatar;