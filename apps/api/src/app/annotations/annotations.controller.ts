import { Controller, Get, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AnnotationsService } from './annotations.service';
import { MediaService } from '../media/media.service';
import { sendMediaFile } from '../media/media.util';
import { User } from '../users/entities/user.entity';

@Controller('annotations')
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService, private readonly mediaService: MediaService) {}

  @Get(':id/media')
  @UseGuards(AuthGuard('jwt'))
  async getMedia(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res: Response): Promise<void> {
    const user: User = req.user;
    // only the annotation owner and the session owner are allowed to access the media
    const annotation = await this.annotationsService.findOne(id, user, true);
    const media = annotation.mediaId ? await this.mediaService.findOne(annotation.mediaId) : undefined;

    await sendMediaFile(media, res);
  }
}
