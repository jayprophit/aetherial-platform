import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export class MfaService {
  static generateSecret() {
    return speakeasy.generateSecret({ length: 20 });
  }

  static async generateQrCode(otpauthUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
        if (err) {
          reject(err);
        } else {
          resolve(dataUrl);
        }
      });
    });
  }

  static verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow for a 30-second window on either side
    });
  }
}

