import { $log } from '@tsed/logger';
import * as crypto from 'crypto';

export class BlockReorderingService {

  static KEY = "aneuck27sSi2m3b$";
  static FLAG = "531f6323-4643-47f7-b6e3-96d48c7274a8";

  // TODO: DO NOT LET BYTE AT A TIME HERE
  public static createToken(username: string, isAdmin = false): string {
    const tokenContent = `username=${username};isAdmin=${isAdmin};at=${new Date().toUTCString()}`;
    const encrypted = this.encryptToken(tokenContent);

    $log.info("Generated token: " + tokenContent);
    $log.info("Encrypted anonymous token " + encrypted);

    return encrypted;
  }

  public static encryptToken(token: string): string {
    const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(BlockReorderingService.KEY), '');
    const tokenBuffer = Buffer.from(token, 'utf8');
    let encrypted = cipher.update(tokenBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString("hex");
  }


  public static decryptToken(token: string): string {
    const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(BlockReorderingService.KEY), '');
    const encryptedText = Buffer.from(token, 'hex');
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const t = decrypted.toString();
    $log.info("Decrypted token: " + t);

    return t;
  }

  public static isAdmin(token: string): boolean {
    $log.info("Decrypting token " + token);
    const tokenObj: any = {};
    const decryptedToken = this.decryptToken(token);
    const tokenPars = decryptedToken.split(";");
    tokenPars.forEach(p => {
      const tmp = p.split("=");
      const key = tmp[0];
      const value = tmp[1];
      tokenObj[key] = value;
    });

    return tokenObj.isAdmin === 'true';

  }
}