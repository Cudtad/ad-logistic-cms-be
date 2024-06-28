import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    default: 'admin@ndexpress.vn',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
