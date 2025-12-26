import { Request, Response } from 'express';
import { VerificationService } from './verification.service';

const verificationService = new VerificationService();

export class VerificationController {

  async submitRequest(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      let filename = '';

      if (req.file) {
          filename = req.file.filename;
      } else if (req.body.isSimulation === 'true' || req.body.isSimulation === true) {
          // Allow simulation without file
          filename = 'placeholder-screenshot.png';
      } else {
          return res.status(400).json({ success: false, message: 'Screenshot image is required' });
      }

      const request = await verificationService.createRequest(user.id, filename);
      res.json({ success: true, data: request });
    } catch (error) {
      console.error('Submit Verification Error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit verification' });
    }
  }

  async getStatus(req: Request, res: Response) {
      try {
          const user = req.user;
          if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

          const request = await verificationService.getStatus(user.id);
          res.json({ success: true, data: request });
      } catch (error) {
          console.error('Get Verification Status Error:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch status' });
      }
  }

  async adminReview(req: Request, res: Response) {
      try {
          const { id } = req.params; // request ID
          const { status, note } = req.body;

          if (!['VERIFIED', 'REJECTED'].includes(status)) {
              return res.status(400).json({ success: false, message: 'Invalid status' });
          }

          const request = await verificationService.reviewRequest(id, status, note);
          res.json({ success: true, data: request });
      } catch (error) {
          console.error('Admin Review Error:', error);
          res.status(500).json({ success: false, message: 'Failed to review request' });
      }
  }
}
