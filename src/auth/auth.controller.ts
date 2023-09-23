import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RequestPasswordResubmitDto } from './dto/request-password-resubmit.dto';
import { ResubmitPasswordDto } from './dto/resubmit-password.dto';
import { SignInDto } from './dto/sign-in.dto';

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
