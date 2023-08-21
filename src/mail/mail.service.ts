import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async validateUser(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to NestShop! Please confirm your registration',
      template: 'confirm',
      context: {
        name: user.name,
      },
    });
  }
}
