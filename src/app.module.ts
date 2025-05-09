import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DebtsModule } from './debts/debts.module';

@Module({
  imports: [DebtsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
