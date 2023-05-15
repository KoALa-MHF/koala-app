import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateToolbarInput } from './dto/update-toolbar.input';
import { Toolbar } from './entities/toolbar.entity';
import { SetToolbarMarkerVisibilityInput } from './dto/set-toolbar-marker-visible.input';

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
    const dbToolbar = await this.findOne(id, user);
    const mergedMarkers = [];
    const dbMarkers = dbToolbar.markers;

    if (updateToolbarInput.markers) {
      //resort according to input, but keep visible information alive
      //merge in new markers in toolbar with visible = true
      updateToolbarInput.markers.forEach((marker) => {
        const matchingMarker = dbMarkers.find((dbMarker) => {
          return dbMarker.markerId.toString() === marker;
        });

        if (matchingMarker) {
          mergedMarkers.push(matchingMarker);
        } else {
          mergedMarkers.push({ markerId: marker, visible: true });
        }
      });
    }

    try {
      await this.toolbarsRepository.update(id, {
        markers: mergedMarkers,
      });
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async setToolbarMarkerVisibility(
    id: number,
    setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput
  ): Promise<Toolbar> {
    const dbToolbar = await this.findOne(id);

    const mergedMarkers = dbToolbar.markers.map((marker) => {
      if (marker.markerId === setToolbarMarkerVisibilityInput.markerId) {
        marker.visible = setToolbarMarkerVisibilityInput.visible;
      }

      return {
        ...marker,
        visible:
          marker.markerId === setToolbarMarkerVisibilityInput.markerId
            ? setToolbarMarkerVisibilityInput.visible
            : marker.visible,
      };
    });

    try {
      await this.toolbarsRepository.update(id, {
        markers: mergedMarkers,
      });
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }
}
