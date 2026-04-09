import {
  ApproveReviewInput,
  RejectReviewInput,
  DeleteCommentInput,
  SuspendUserInput,
  FlagContentInput,
  ResolveFlagInput,
  GetModerationQueueQuery,
  GetFlaggedContentQuery,
} from './moderation.validation';

export interface IModerationService {
  approveReview(id: string, adminId: string): Promise<any>;
  rejectReview(id: string, adminId: string, input: RejectReviewInput): Promise<any>;
  deleteComment(id: string, adminId: string, input: DeleteCommentInput): Promise<any>;
  suspendUser(input: SuspendUserInput, adminId: string): Promise<any>;
  unsuspendUser(userId: string, adminId: string): Promise<any>;
  flagContent(userId: string, input: FlagContentInput): Promise<any>;
  getModerationQueue(limit: number, page: number, status?: string, type?: string, sortBy?: string, order?: string): Promise<any>;
  getFlaggedContent(limit: number, page: number, contentType?: string, status?: string, sortBy?: string, order?: string): Promise<any>;
  resolveFlag(flagId: string, adminId: string, input: ResolveFlagInput): Promise<any>;
  getModerationHistory(limit: number, page: number, userId?: string, action?: string, sortBy?: string, order?: string): Promise<any>;
  getContentModerationStats(): Promise<any>;
}
