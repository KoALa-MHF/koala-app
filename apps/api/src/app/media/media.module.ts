import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaController } from './media.controller';

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
  controllers: [
    MediaController,
  ],
  exports: [
    MediaService,
  ],
})
export class MediaModule {}
