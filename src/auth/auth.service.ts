import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { VerifyUserDto } from './dto/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    try {
      const hashedPassword = await this.hashingService.hash(signUpDto.password);
      const user = (await this.usersRepository.save({
        ...signUpDto,
        password: hashedPassword,
      })) as User;
      await this.mailService.validateUser(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException(
          'Email address has already been registered.',
        );
      }
      throw err;
    }
  }

  //TODO: use unique generated token instead of id
  async verifyUser(verifyUserDto: VerifyUserDto) {
    const { id } = verifyUserDto;
    const user = await this.usersRepository.findOneBy({ id });
    await this.usersRepository.save({ ...user, status: UserStatus.VERIFIED });
    //TODO: Send mail ?
  }
}
