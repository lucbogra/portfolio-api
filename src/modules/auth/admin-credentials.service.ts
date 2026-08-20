import { Injectable } from '@nestjs/common';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

@Injectable()
export class AdminCredentialsService {
  getCredentials(): AdminCredentials {
    const username = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!username || !passwordHash) {
      throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD_HASH non configurés');
    }

    return { username, passwordHash };
  }
}