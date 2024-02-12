import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'user/dto';
import {
  VerifyUserDto,
  RequestPasswordResubmitDto,
  ResubmitPasswordDto,
  SignInDto,
} from 'auth/dto';
import { Public } from 'auth/decorators';
import { AuthService } from './auth.service';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('verify')
  verify(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }

  @Post('request-password-resubmit')
  requestPasswordResubmit(
    @Body() requestPasswordResubmitDto: RequestPasswordResubmitDto,
  ) {
    return this.authService.requestPasswordResubmit(requestPasswordResubmitDto);
  }

  @Post('resubmit-password')
  resubmitPassword(@Body() resubmitPasswordDto: ResubmitPasswordDto) {
    return this.authService.resubmitPassword(resubmitPasswordDto);
  }
}
