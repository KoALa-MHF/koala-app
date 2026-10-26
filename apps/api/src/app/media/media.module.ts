import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
    ]),
  ],
  providers: [
    MediaService,
  ],
  exports: [
    MediaService,
  ],
})
export class MediaModule {}
