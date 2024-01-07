import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Profile } from '@node-saml/passport-saml';
import { selectConfig } from 'nest-typed-config';
import { ConfigModule } from '../config/config.module';
import { SamlConfig } from '../config/config';

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

  findBySamlId(samlId: string) {
    return this.usersRespository.findOneBy({ samlId });
  }

  async upsertBySamlProfile(profile: Profile, samlConfig: SamlConfig): Promise<User> {
    let displayName = profile.displayName as string;
    if (!displayName) {
      displayName = `${profile[samlConfig.lastnamePropertyName]} ${profile[samlConfig.firstnamePropertyName]}`;
    }
    const samlId = profile[samlConfig.samlIdPropertyName] as string;
    let email = '';

    if (Array.isArray(profile[samlConfig.emailPropertyName])) {
      email = profile[samlConfig.emailPropertyName][0];
    } else {
      email = profile[samlConfig.emailPropertyName].toString().split(';')[0];
    }

    let user = await this.findBySamlId(samlId);
    if (!user) {
      user = await this.findByEmail(email);
    }

    if (user) {
      user.samlId = samlId;
      user.email = email;
      user.displayName = displayName;
    } else {
      user = this.usersRespository.create({
        email,
        samlId,
        displayName,
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
