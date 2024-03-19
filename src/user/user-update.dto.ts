import { IsNotEmpty, MinLength } from 'class-validator';
import { IsConfirmed } from 'src/validators/is-confirmed.validator';
import { Pair } from 'src/validators/pair.validator';
import { Unique } from 'src/validators/unique.validator';
import { User } from './user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  @Unique(User)
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  @Pair('passwordConfirmation')
  @IsConfirmed('passwordConfirmation')
  password?: string;

  @IsNotEmpty()
  passwordConfirmation?: string;
}
