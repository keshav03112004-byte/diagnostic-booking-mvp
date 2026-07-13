const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../uploads');
const videoDir = path.join(uploadDir, 'videos');
const imageDir = path.join(uploadDir, 'images');

[uploadDir, videoDir, imageDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    cb(null, isVideo ? videoDir : imageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
    cb(null, `${Date.now()}-${safeName || `file${ext}`}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /^(video\/|image\/)/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only video and image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

exports.uploadMedia = upload.single('file');

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const folder = req.file.mimetype.startsWith('video/') ? 'videos' : 'images';
  const url = `/uploads/${folder}/${req.file.filename}`;

  return res.json({
    message: 'File uploaded',
    url,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
  });
};
