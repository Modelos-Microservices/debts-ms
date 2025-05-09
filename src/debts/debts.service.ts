import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Debt } from './entities/debt.entity';
import { DebtStatus } from '@prisma/client';
import { DebtPaginationDto } from './dto/debt-pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DebtsService {

  constructor(private readonly prisma: PrismaService,) {
  }


  async create(createDebtDto: CreateDebtDto) {
    //validamos si el usuario ya tiene una deuda pendiente
    const { amount, description, user_id } = createDebtDto;

    const existingDebt = await this.prisma.customerDebt.findFirst({
      where: {user_id: user_id, status: DebtStatus.PENDING}
    });
    if (existingDebt) {
      throw new Error('User already has a pending debt you can not create another one until the first one is paid');
    } 
    //si no existe la deuda creamos una nueva
    const debt = await this.prisma.customerDebt.create({
      data: {
        amount,
        description,
        user_id: user_id,
        //traemos el status directamente del enum
        status: DebtStatus.PENDING,
      }
    });
    return debt;
  }

  async findAll(pagination: DebtPaginationDto): Promise<Object> {
    const { page, limit } = pagination
    const totalOrders = await this.prisma.customerDebt.count({ where: { status: pagination.status } })

    if (totalOrders === 0 && pagination.status) {
      throw new RpcException({ status: 404, message: `There is no debts with status:${pagination.status}` })
    }

    const lastPage = Math.ceil(totalOrders / limit)

    return {
      meta: {
        actualPage: page,
        totalOrders: totalOrders,
        lastPage: lastPage
      },
      data: await this.prisma.customerDebt.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: pagination.status }
      })
    };
  }

  async findOne(id: string) {
    const debt = await this.prisma.customerDebt.findUnique({
      where: {
        id
      }
    });
    if (!debt) {
      throw new Error('Debt not found');
    }
    return debt;
  }

  async update(updateDebtDto: UpdateDebtDto) {
    //verificamos si existe la deuda
    const { id, status } = updateDebtDto;
    this.findOne(id)
    //actualizamos el status de la deuda
    const debt = await this.prisma.customerDebt.update({
      where: {
        id
      },
      data: {
        status
      }
    });
    return debt;
  }

  async remove(id: string) {
    //verificamos si existe la deuda
    this.findOne(id)
    //eliminamos la deuda
    return await this.prisma.customerDebt.delete({
      where: {
        id
      }
    });
  }

  async findAllByUserId(userId: string) {
    const debts = await this.prisma.customerDebt.findMany({
      where: {
        user_id: userId
      }
    });
    if (!debts) {
      throw new RpcException({ status: 404, message: `There are no debts for user with id:${userId}` });
    }
    return debts;
  }
}
