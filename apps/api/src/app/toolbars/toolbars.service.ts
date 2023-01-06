import { Injectable } from '@nestjs/common';
import { CreateToolbarInput } from './dto/create-toolbar.input';
import { UpdateToolbarInput } from './dto/update-toolbar.input';

@Injectable()
export class ToolbarsService {
  create(createToolbarInput: CreateToolbarInput) {
    return 'This action adds a new toolbar';
  }

  findAll() {
    return `This action returns all toolbars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toolbar`;
  }

  update(id: number, updateToolbarInput: UpdateToolbarInput) {
    return `This action updates a #${id} toolbar`;
  }

  remove(id: number) {
    return `This action removes a #${id} toolbar`;
  }

  addMarkerToToolbar(toolbarId: number, markerId) {
    return `This action removes a #${id} toolbar`;
  }
}
