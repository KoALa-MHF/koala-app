import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { SeederInterface } from '../seeder.interface';

@Injectable()
export class UsersSeeder implements SeederInterface<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async seed(): Promise<User[]> {
    const users: Partial<User>[] = [];
    for (let i = 0; i < 3; i++) {
      users.push(
        this.usersRepository.create({
          email: faker.internet.email(),
          displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        })
      );
    }
    return await this.usersRepository.save(users);
  }
}
