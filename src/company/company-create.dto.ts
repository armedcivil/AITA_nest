import { IsNotEmpty, MinLength } from 'class-validator';
import { IsConfirmed } from 'src/validators/is-confirmed.validator';
import { Pair } from 'src/validators/pair.validator';
import { Unique } from 'src/validators/unique.validator';
import { Company } from './company.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  @Unique(Company)
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  @Pair('passwordConfirmation')
  @IsConfirmed('passwordConfirmation')
  password?: string;

  @IsNotEmpty()
  passwordConfirmation?: string;
}
