import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity"
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable(

)
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const res = await this.userRepository.save(createUserDto);
      if (!res) {
        throw new ForbiddenException();
      }
      return res;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }

  }

  async findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }


  async findOne(id: string) {
    try {
      const res = await this.userRepository.findOneBy({ id });
      if (!res) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return res;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const res = await this.userRepository.findOneBy({ id });
      if (!res) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updatedRes = await this.userRepository.save({ id: id, ...updateUserDto });
      return updatedRes;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Server Error',
      }, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }
  }

  async remove(id: string) {
    try {
      const res = await this.userRepository.softDelete({ id })
      return res;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

}
