import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { RequestPasswordResubmitDto } from './dto/request-password-resubmit.dto';
import { ResubmitPasswordDto } from './dto/resubmit-password.dto';
import { UserStatus } from 'src/user/interfaces/user-status.enum';
import { SignInDto } from './dto/sign-in.dto';
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
      const verificationLink = uuidv4();
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
    user.resubmitPasswordLink = uuidv4();
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
