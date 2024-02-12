import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Profile } from '@node-saml/passport-saml';
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
    if (!email) {
      return null;
    }
    const lowerCaseEmail = email.toLowerCase();
    return lowerCaseEmail ? this.usersRespository.findOneBy({ email: lowerCaseEmail }) : null;
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
    let emails;

    if (Array.isArray(profile[samlConfig.emailPropertyName])) {
      emails = profile[samlConfig.emailPropertyName];
    } else {
      emails = profile[samlConfig.emailPropertyName].toString().split(';');
    }

    const email = emails[0];

    let user = await this.findBySamlId(samlId);
    if (!user) {
      //check all available email addresses, if a user already exists, for consistency to email changes/adjustments,
      //but still store the first
      for (let i = 0; i < emails.length; i++) {
        user = await this.findByEmail(emails[i]);
        if (user) {
          break;
        }
      }
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
