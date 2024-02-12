import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { VerifyUserDto } from './dto/verify-user.dto';
import { randomUUID } from 'crypto';
import { MailService } from 'mail';
import { User } from 'user/entities';
import { HashingService } from 'auth/hashing';
import { CreateUserDto } from 'user/dto';
import {
  RequestPasswordResubmitDto,
  ResubmitPasswordDto,
  SignInDto,
} from 'auth/dto';
import { UserStatus } from 'user/interfaces';

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
      const verificationLink = randomUUID();
      const user = (await this.usersRepository.save({
        ...signUpDto,
        verificationLink,
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

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new ConflictException('Password does not match');
    }
    if (user.status === UserStatus.UNVERIFIED) {
      throw new ConflictException('User is not verified');
    }
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        id: user.id,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    const { verificationLink } = verifyUserDto;
    const user = await this.usersRepository.findOneBy({ verificationLink });
    if (!user) {
      throw new NotFoundException('Wrong verification link');
    }
    if (user.status === UserStatus.VERIFIED) {
      throw new BadRequestException('User has been already verified');
    }
    user.status = UserStatus.VERIFIED;
    await this.usersRepository.save(user);
    //TODO: Send mail ?
  }

  async requestPasswordResubmit(
    requestPasswordResubmitDto: RequestPasswordResubmitDto,
  ) {
    const { email } = requestPasswordResubmitDto;
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('There is no user with this email address');
    }
    user.resubmitPasswordLink = randomUUID();
    await this.usersRepository.save(user);
    await this.mailService.requestPasswordResubmit(user);
  }

  async resubmitPassword(resubmitPasswordDto: ResubmitPasswordDto) {
    const { resubmitPasswordLink, password } = resubmitPasswordDto;
    const user = await this.usersRepository.findOneBy({ resubmitPasswordLink });
    if (!user) {
      throw new NotFoundException('Wrong resubmit link');
    }
    const hashedPassword = await this.hashingService.hash(password);
    user.password = hashedPassword;
    user.resubmitPasswordLink = null;
    await this.usersRepository.save(user);
  }
}
