import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, '../uploads'));
  }
});

const upload = multer({ storage });
export { multer, upload };