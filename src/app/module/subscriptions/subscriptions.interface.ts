import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  CancelSubscriptionInput,
  GetSubscriptionsQuery,
  CreateSubscriptionTierInput,
  UpdateSubscriptionTierInput,
  GetSubscriptionTiersQuery,
} from './subscriptions.validation';

export interface ISubscriptionService {
  createSubscription(userId: string, input: CreateSubscriptionInput): Promise<any>;
  getSubscription(id: string): Promise<any>;
  getUserSubscription(userId: string): Promise<any>;
  getUserSubscriptions(userId: string, limit: number, page: number, status?: string, sortBy?: string, order?: string): Promise<any>;
  getAllSubscriptions(limit: number, page: number, status?: string, sortBy?: string, order?: string): Promise<any>;
  updateSubscription(id: string, userId: string, input: UpdateSubscriptionInput): Promise<any>;
  cancelSubscription(id: string, userId: string, input: CancelSubscriptionInput): Promise<any>;
  checkSubscriptionAccess(userId: string, contentType: string): Promise<any>;
  createSubscriptionTier(input: CreateSubscriptionTierInput): Promise<any>;
  getSubscriptionTiers(limit: number, page: number, isActive?: boolean, sortBy?: string, order?: string): Promise<any>;
  getSubscriptionTier(id: string): Promise<any>;
  updateSubscriptionTier(id: string, input: UpdateSubscriptionTierInput): Promise<any>;
  deleteSubscriptionTier(id: string): Promise<any>;
  renewExpiredSubscriptions(): Promise<any>;
}
