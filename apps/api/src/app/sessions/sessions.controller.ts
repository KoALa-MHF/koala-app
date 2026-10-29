import { Controller, Get, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { SessionsService } from './sessions.service';
import { MediaService } from '../media/media.service';
import { sendMediaFile } from '../media/media.util';
import { User } from '../users/entities/user.entity';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService, private readonly mediaService: MediaService) {}

  @Get(':id/media')
  @UseGuards(AuthGuard('jwt'))
  async getMedia(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res: Response): Promise<void> {
    const user: User = req.user;
    // only the session owner and participants are allowed to access the session
    const session = await this.sessionsService.findOne(id, user);
    const media = session.mediaId ? await this.mediaService.findOne(session.mediaId) : undefined;

    await sendMediaFile(media, res);
  }
}
