import {
  GetAnalyticsQuery,
  GetUserStatsQuery,
  GetMovieStatsQuery,
  GetPaymentStatsQuery,
} from './analytics.validation';

export interface IAnalyticsService {
  getDashboardStats(query: GetAnalyticsQuery): Promise<any>;
  getUserStats(limit: number, page: number, sortBy?: string, order?: string): Promise<any>;
  getMovieStats(limit: number, page: number, sortBy?: string, order?: string): Promise<any>;
  getPaymentStats(query: GetPaymentStatsQuery): Promise<any>;
  getSubscriptionStats(): Promise<any>;
  getEngagementStats(query: GetAnalyticsQuery): Promise<any>;
  getContentPerformance(): Promise<any>;
  getUserGrowth(period: string): Promise<any>;
  getRevenueStats(query: GetPaymentStatsQuery): Promise<any>;
}
