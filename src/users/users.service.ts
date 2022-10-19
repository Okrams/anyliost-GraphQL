import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create(signupInput: SignupInput):Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.usersRepository.save( newUser );
    } catch (error) {
      this.hanldeErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]):Promise<User[]> {

    if(roles.length === 0) return this.usersRepository.find();

    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany()
      
  }

  async findOneByEmail( email: string ):Promise<User>{
    try {
      return await this.usersRepository.findOneByOrFail({email})
    } catch (error) {
      this.hanldeErrors(error);
    }
  }

  async findOneById( id: string ):Promise<User>{
    try {
      return await this.usersRepository.findOneByOrFail({id})
    } catch (error) {
      this.hanldeErrors(error);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, updateBy: User):Promise<User> {
    try {
      const user = await this.usersRepository.preload({...updateUserInput});
      user.lastUpdateBy = updateBy;

      return await this.usersRepository.save(user);
      
    } catch (error) {
      this.hanldeErrors(error);
    }
  }

  async block(id: string, user: User):Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = user;

    return await this.usersRepository.save(userToBlock);
  }

  private hanldeErrors(error: any):never{
    if(error.code === '23505') throw new BadRequestException(error.detail.replace('key', ''));
    this.logger.error( error );
    throw new InternalServerErrorException('Please check server logs');
  }
}
