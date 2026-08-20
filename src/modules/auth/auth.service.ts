import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminCredentialsService } from './admin-credentials.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminCredentialsService: AdminCredentialsService,
  ) {}

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const credentials = this.adminCredentialsService.getCredentials();

    if (username !== credentials.username) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const motDePasseValide = await bcrypt.compare(password, credentials.passwordHash);
    if (!motDePasseValide) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: 'admin', username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}