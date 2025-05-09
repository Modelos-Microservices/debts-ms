import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtDto } from './create-debt.dto';
import { IsDefined, IsEnum, IsUUID } from 'class-validator';
import { DebtStatus } from '@prisma/client';

export class UpdateDebtDto {
  @IsUUID()
  @IsDefined()
  id: string
  //unicamente podemos actualizar el estado de la deuda
  @IsEnum(DebtStatus) 
  @IsDefined()
  status: DebtStatus;
}
