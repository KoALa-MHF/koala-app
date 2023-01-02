import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
    ]),
  ],
  providers: [
    MediaResolver,
    MediaService,
  ],
})
export class MediaModule {}
