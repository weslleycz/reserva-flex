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

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhone()
  telephone: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Match('password', {
    message: "Passwords don't match",
  })
  passwordConfirm!: string;
}
