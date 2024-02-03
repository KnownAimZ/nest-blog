import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './decorators/user.decorator';
import { User as UserEntity } from './entities/user.entity';

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
