import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async update(id: number, updateToolbarInput: UpdateToolbarInput) {
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
