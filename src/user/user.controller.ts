import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'user/decorators';
import { User as UserEntity } from 'user/entities';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/details')
  getDetails(@User() user: UserEntity) {
    return this.userService.getDetails(user.id);
  }
}
