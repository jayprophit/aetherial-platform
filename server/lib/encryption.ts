'''
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a-very-secure-secret-key-that-is-at-least-32-bytes-long';

if (ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 bytes long.');
}

export class EncryptionService {
  static encrypt(text: string): string {
    if (!text) {
      return text;
    }
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  static decrypt(ciphertext: string): string {
    if (!ciphertext) {
      return ciphertext;
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
'''
