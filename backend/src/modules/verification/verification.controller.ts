import { Request, Response } from 'express';
import { VerificationService } from './verification.service';

export class VerificationController {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  async uploadProof(req: Request, res: Response) {
    try {
      const { userId, imageBase64 } = req.body;

      if (!userId || !imageBase64) {
        return res.status(400).json({ error: 'User ID and Image are required' });
      }

      const result = await this.verificationService.uploadProof(userId, imageBase64);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const status = await this.verificationService.checkStatus(userId);
      return res.status(200).json({ status });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
