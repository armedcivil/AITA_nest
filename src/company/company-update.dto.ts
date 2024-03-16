import { IsEmail, MinLength } from 'class-validator';
import { IsConfirmed } from 'src/validators/is-confirmed.validator';
import { Pair } from 'src/validators/pair.validator';
import { UniqueIgnore } from 'src/validators/unique-ignore.validator';
import { Company } from './company.entity';

export class UpdateCompanyDto {
  name?: string;

  @IsEmail()
  @UniqueIgnore(Company)
  email?: string;

  @MinLength(8)
  @Pair('passwordConfirmation')
  @IsConfirmed('passwordConfirmation')
  password?: string;

  passwordConfirmation?: string;
}
