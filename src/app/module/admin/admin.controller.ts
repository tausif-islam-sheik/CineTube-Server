import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import {
  getUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  createAdminSchema,
  updateUserSchema,
  deleteUserSchema,
} from './admin.validation';
import { AuthenticatedRequest } from '../auth/auth.interface';

export class AdminController {
  /**
   * Get all users
   */
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = getUsersQuerySchema.parse(req.query);

    const result = await adminService.getAllUsers(query.limit, query.page, query.role, query.status, query.sortBy, query.order);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Users fetched successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });

  /**
   * Get user details
   */
  getUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    const result = await adminService.getUser(userId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  });

  /**
   * Update user role
   */
  updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const body = updateUserRoleSchema.parse(req.body);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await adminService.updateUserRole(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User role updated successfully',
      data: result,
    });
  });

  /**
   * Update user status
   */
  updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const body = updateUserStatusSchema.parse(req.body);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await adminService.updateUserStatus(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User status updated successfully',
      data: result,
    });
  });

  /**
   * Promote user to admin
   */
  promoteToAdmin = catchAsync(async (req: Request, res: Response) => {
    const body = createAdminSchema.parse(req.body);
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await adminService.promoteToAdmin(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'User promoted to admin successfully',
      data: result,
    });
  });

  /**
   * Update user
   */
  updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const params = { userId };
    const body = updateUserSchema.parse({ ...req.body, ...params });
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await adminService.updateUser(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  });

  /**
   * Delete user
   */
  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const params = { userId };
    const body = deleteUserSchema.parse({ ...req.body, ...params });
    const adminId = (req as AuthenticatedRequest).user?.id || '';

    const result = await adminService.deleteUser(body, adminId);

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  });

  /**
   * Get admin action log
   */
  getAdminLog = catchAsync(async (req: Request, res: Response) => {
    const { limit = 50, page = 1 } = req.query;

    const result = await adminService.getAdminLog(Number(limit), Number(page));

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Admin log fetched successfully',
      data: result.data,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    });
  });

  /**
   * Get system health
   */
  getSystemHealth = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getSystemHealth();

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'System health fetched successfully',
      data: result,
    });
  });
}

export const adminController = new AdminController();
