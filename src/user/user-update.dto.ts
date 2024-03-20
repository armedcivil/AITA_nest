import { MinLength, IsEmail } from 'class-validator';
import { IsConfirmed } from 'src/validators/is-confirmed.validator';
import { Pair } from 'src/validators/pair.validator';
import { UniqueIgnore } from 'src/validators/unique-ignore.validator';
import { User } from './user.entity';

export class UpdateUserDto {
  name?: string;

  @IsEmail()
  @UniqueIgnore(User)
  email?: string;

  @MinLength(8)
  @Pair('passwordConfirmation')
  @IsConfirmed('passwordConfirmation')
  password?: string;

  passwordConfirmation?: string;
}
