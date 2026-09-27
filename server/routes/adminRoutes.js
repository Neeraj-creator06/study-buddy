const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/adminController');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
