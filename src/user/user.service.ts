import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserDTO } from './dto/user.dot';
import { IUser } from '../common/interfaces/user.interface';
import { USER } from '../common/models/models';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUSer = new this.model({ ...userDTO, password: hash });
    return await newUSer.save();
  }

  async findAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<IUser> {
    return await this.model.findById(id);
  }

  async update(id: string, userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const user = { ...userDTO, password: hash };
    return await this.model.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
