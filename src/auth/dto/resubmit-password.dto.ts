import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResubmitPasswordDto {
  @ApiProperty({ description: 'Resubmit link' })
  @IsUUID(4)
  resubmitPasswordLink: string;

  @ApiProperty({ description: "New user's password" })
  @MinLength(8)
  @IsString()
  password: string;
}
