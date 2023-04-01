import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRespository: Repository<User>
  ) {}

  findOne(id: number) {
    return this.usersRespository.findOneByOrFail({ id });
  }

  findByEmail(email: string) {
    return email ? this.usersRespository.findOneBy({ email }) : null;
  }

  async update(id: number, updateUserSessionInput: UpdateUserInput): Promise<User> {
    try {
      await this.usersRespository.update(id, {
        displayName: updateUserSessionInput.displayName,
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }
}
