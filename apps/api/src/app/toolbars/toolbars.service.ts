import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { Toolbar } from './entities/toolbar.entity';

@Injectable()
export class ToolbarsService {
  constructor(
    @InjectRepository(Toolbar)
    private toolbarsRepository: Repository<Toolbar>
  ) {}

  findOne(id: number): Promise<Toolbar> {
    return this.toolbarsRepository.findOneByOrFail({ id });
  }

  findAll(sessionId?: number): Promise<Toolbar[]> {
    return this.toolbarsRepository.findBy(
      sessionId
        ? {
            sessionId: sessionId,
          }
        : null
    );
  }

  async update(id: number, updateToolbarInput: UpdateToolbarInput): Promise<Toolbar> {
    try {
      await this.toolbarsRepository.update(id, {
        markers: updateToolbarInput.markers,
      });
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }
}
