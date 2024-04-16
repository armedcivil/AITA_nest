import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { AfterDate } from 'src/validators/after-date.validator';

export class ReservationDto {
  @IsNotEmpty()
  @IsUUID()
  sheetId: string;

  @IsNotEmpty()
  @IsDateString()
  startTimestamp: string;

  @IsNotEmpty()
  @IsDateString()
  @AfterDate('startTimestamp')
  endTimestamp: string;
}
