import { Controller, Logger, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DebtPaginationDto } from './dto/debt-pagination.dto';
import { DebtsService } from './debts.service';

@Controller()
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}
  private loger = new Logger(DebtsController.name);

  @MessagePattern({ cmd: 'createDebt' })
  create(@Payload() createDebtDto: CreateDebtDto) {
    //return {message: 'createDebt', data: createDebtDto};
    return this.debtsService.create(createDebtDto);
  }

  @MessagePattern({ cmd: 'findAllDebts' })
  findAll(@Payload() pagination: DebtPaginationDto) {
    return this.debtsService.findAll(pagination);
  }

  @MessagePattern({ cmd: 'findAllDebtsByUserId' })
  findAllByUserId(@Payload() userId: string) {
    return this.debtsService.findAllByUserId(userId);
  }

  @MessagePattern({ cmd: 'findOneDebt' })
  findOne(@Payload(ParseUUIDPipe) id: string ) {
    return this.debtsService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateDebt' })
  update(@Payload() updateDebtDto: UpdateDebtDto) {
    return this.debtsService.update( updateDebtDto);
  }

  @MessagePattern({ cmd: 'removeDebt' })
  remove(@Payload(ParseUUIDPipe) id: string) {
    return this.debtsService.remove(id);
  }
}