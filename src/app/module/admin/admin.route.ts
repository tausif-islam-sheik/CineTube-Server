import { Router } from 'express';
import { adminController } from './admin.controller';
import { checkRole } from '../../middleware/checkAuth';

const router = Router();

// All admin routes
router.get('/admin/users', checkRole('ADMIN'), adminController.getAllUsers);
router.get('/admin/users/:userId', checkRole('ADMIN'), adminController.getUser);
router.patch('/admin/users/:userId/role', checkRole('ADMIN'), adminController.updateUserRole);
router.patch('/admin/users/:userId/status', checkRole('ADMIN'), adminController.updateUserStatus);
router.post('/admin/users/promote', checkRole('ADMIN'), adminController.promoteToAdmin);
router.patch('/admin/users/:userId', checkRole('ADMIN'), adminController.updateUser);
router.delete('/admin/users/:userId', checkRole('ADMIN'), adminController.deleteUser);
router.get('/admin/logs', checkRole('ADMIN'), adminController.getAdminLog);
router.get('/admin/health', checkRole('ADMIN'), adminController.getSystemHealth);

export default router;
