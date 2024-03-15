import { IsEmail, MinLength } from 'class-validator';
import { IsConfirmed } from 'src/validators/is-confirmed.validator';
import { Pair } from 'src/validators/pair.validator';

export class UpdateCompanyDto {
  name?: string;

  @IsEmail()
  email?: string;

  @MinLength(8)
  @Pair('passwordConfirmation')
  @IsConfirmed('passwordConfirmation')
  password?: string;

  passwordConfirmation?: string;
}
