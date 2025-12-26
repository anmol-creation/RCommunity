import prisma from '../../utils/prisma';

export class ReportService {
  async createReport(reporterId: string, data: { postId?: string; commentId?: string; reason: string }) {
    if (!data.postId && !data.commentId) {
        throw new Error('Must report either a post or a comment');
    }

    return await prisma.report.create({
        data: {
            reporterId,
            postId: data.postId,
            commentId: data.commentId,
            reason: data.reason
        }
    });
  }
}
