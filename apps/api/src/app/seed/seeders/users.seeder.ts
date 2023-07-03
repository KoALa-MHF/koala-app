import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SeederInterface } from '../seeder.interface';
import { UsersData } from '../data/users.data';

@Injectable()
export class UsersSeeder implements SeederInterface<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async seed(): Promise<User[]> {
    const users: Partial<User>[] = [];

    Object.values(UsersData).forEach((user) => {
      users.push(this.usersRepository.create(user));
    });

    return await this.usersRepository.save(users);
  }
}
