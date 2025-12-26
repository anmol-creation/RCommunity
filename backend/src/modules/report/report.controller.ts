import { Request, Response } from 'express';
import { ReportService } from './report.service';

const reportService = new ReportService();

export class ReportController {

  async createReport(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      // Assuming "Safe Space" means checking if user is allowed to report?
      // Usually reporting is open to all authenticated users, even visitors, to keep it safe.
      // But let's stick to "Visitor - Cannot post, comment, like, vote". Reporting isn't explicitly forbidden.
      // Let's allow reporting for everyone logged in.

      const { postId, commentId, reason } = req.body;
      const report = await reportService.createReport(user.id, { postId, commentId, reason });

      res.status(201).json({ success: true, data: report });
    } catch (error: any) {
      console.error('Create Report Error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to submit report' });
    }
  }
}
