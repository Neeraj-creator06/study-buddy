const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  deleteMaterial,
} = require('../controllers/materialController');

router.use(protect);

router.route('/')
  .post(upload.single('file'), uploadMaterial)
  .get(getMaterials);

router.route('/:id')
  .get(getMaterialById)
  .delete(deleteMaterial);

module.exports = router;
