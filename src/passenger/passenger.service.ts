import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IPassenger } from '../common/interfaces/passenger,interface';
import { PASSENGER } from '../common/models/models';
import { PassengerDTO } from './dto/passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) { }
  async create(passengerDTO: PassengerDTO): Promise<IPassenger> {
    const newPassanger = new this.model(passengerDTO);
    return await newPassanger.save();
  }

  async findAll(): Promise<IPassenger[]> {
    return this.model.find();
  }

  async findOne(id: string): Promise<IPassenger> {
    return this.model.findById(id);
  }

  async update(id: string, passengerDTO: PassengerDTO): Promise<IPassenger> {
    return this.model.findByIdAndUpdate(id, passengerDTO);
  }

  async delete(id: string): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
