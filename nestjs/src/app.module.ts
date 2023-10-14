import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [PrismaModule, ItemModule],
})
export class AppModule {}
