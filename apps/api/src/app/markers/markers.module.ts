import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersResolver } from './markers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './entities/marker.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Marker,
    ]),
    UsersModule,
  ],
  providers: [
    MarkersResolver,
    MarkersService,
  ],
  exports: [
    MarkersService,
  ],
})
export class MarkersModule {}
