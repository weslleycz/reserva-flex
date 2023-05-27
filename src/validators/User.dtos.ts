import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsPhone } from 'brazilian-class-validator';
import { Match } from '../decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhone()
  @ApiProperty()
  telephone: string;

  @IsString()
  @MinLength(7)
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty()
  @Match('password', {
    message: "Passwords don't match",
  })
  passwordConfirm!: string;
}
