import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersResolver } from './markers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marker } from './entities/marker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marker])],
  providers: [MarkersResolver, MarkersService],
})
export class MarkersModule {}
