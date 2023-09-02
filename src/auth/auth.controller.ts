import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RequestPasswordResubmitDto } from './dto/request-password-resubmit.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('verify')
  verify(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }

  @Post('request-password-resubmit')
  requestPasswordResubmit(
    @Body() requestPasswordResubmit: RequestPasswordResubmitDto,
  ) {
    return this.authService.requestPasswordResubmit(requestPasswordResubmit);
  }
}
