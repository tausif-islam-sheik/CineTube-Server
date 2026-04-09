import {
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  GetUsersQuery,
  CreateAdminInput,
  UpdateUserInput,
  DeleteUserInput,
} from './admin.validation';

export interface IAdminService {
  getAllUsers(limit: number, page: number, role?: string, status?: string, sortBy?: string, order?: string): Promise<any>;
  getUser(userId: string): Promise<any>;
  updateUserRole(input: UpdateUserRoleInput, adminId: string): Promise<any>;
  updateUserStatus(input: UpdateUserStatusInput, adminId: string): Promise<any>;
  promoteToAdmin(input: CreateAdminInput, adminId: string): Promise<any>;
  updateUser(input: UpdateUserInput, adminId: string): Promise<any>;
  deleteUser(input: DeleteUserInput, adminId: string): Promise<any>;
  getAdminLog(limit: number, page: number): Promise<any>;
  getSystemHealth(): Promise<any>;
}
