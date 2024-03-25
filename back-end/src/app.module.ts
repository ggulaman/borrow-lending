import { Module } from '@nestjs/common';
import { InfuraController } from './app.controller';
import { InfuraService } from './app.service';

@Module({
  controllers: [InfuraController],
  providers: [InfuraService],
})
export class AppModule { }
