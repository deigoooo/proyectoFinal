import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder;
    switch (file.fieldname) {
      case "profile":
        destinationFolder = "./src/public/img/profile";
        break;
      case "products":
        destinationFolder = "./src/public/img/products";
        break;
      case "documents":
        destinationFolder = "./src/public/img/documents";
        break;
      default:
        destinationFolder = "./src/public/img"; // Carpeta predeterminada si no coincide ningún caso
    }

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    const userId = req.session.user._id;
    const timestamp = Date.now();
    const originalFileName = file.originalname;
    const extension = originalFileName.split('.').pop();
    const newFileName = `${userId}-${timestamp}.${extension}`;
    cb(null, newFileName);
  },
});
export const uploader = multer({ storage });
