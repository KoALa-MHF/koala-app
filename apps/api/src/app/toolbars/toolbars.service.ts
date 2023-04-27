import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { Toolbar } from './entities/toolbar.entity';

@Injectable()
export class ToolbarsService {
  constructor(
    @InjectRepository(Toolbar)
    private toolbarsRepository: Repository<Toolbar>
  ) {}

  findOne(id: number, user?: User): Promise<Toolbar> {
    const toolbar = this.toolbarsRepository.findOne({
      where: [
        {
          id,
          session: {
            ownerId: user?.id,
          },
        },
      ],
    });

    if (!toolbar) {
      throw new NotFoundException();
    }

    return toolbar;
  }

  findAll(sessionId?: number): Promise<Toolbar[]> {
    return this.toolbarsRepository.find({
      where: {
        sessionId,
      },
    });
  }

  async update(id: number, updateToolbarInput: UpdateToolbarInput, user: User): Promise<Toolbar> {
    const toolbar = await this.findOne(id, user);
    await this.toolbarsRepository.merge(toolbar, {
      markers: updateToolbarInput.markers,
    });
    return this.toolbarsRepository.save(toolbar);
  }
}
