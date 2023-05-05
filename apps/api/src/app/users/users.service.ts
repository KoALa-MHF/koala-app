import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Profile } from '@node-saml/passport-saml';

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

  async upsertBySamlProfile(profile: Profile): Promise<User> {
    const displayName = `${profile.firstName} ${profile.lastName}`;
    let user = await this.findByEmail(profile.email);
    if (user) {
      if (!user.samlId) {
        user.samlId = profile.id as string;
      }
      user.displayName = displayName;
    } else {
      user = this.usersRespository.create({
        email: profile.email,
        samlId: profile.id as string,
        displayName: displayName,
      });
    }

    return this.usersRespository.save(user);
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
