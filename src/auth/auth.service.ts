import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginInput, SignupInput } from './dto';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    private getJwtToken(userId: string){
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SignupInput):Promise<AuthResponse>{
       
        const user = await this.usersService.create( signupInput );
        const token = this.getJwtToken(user.id);
        
        return{
            token,
            user
        }
    }

    async login (loginInput: LoginInput): Promise<AuthResponse>{
        const user = await this.usersService.findOneByEmail(loginInput.email);

        const token = this.getJwtToken(user.id);
        
        if( !bcrypt.compareSync(loginInput.password, user.password) )  throw new BadRequestException(' Credenciales no validas')

        return {
            token, 
            user
        }
    }

    async validateuser (id: string): Promise<User>{

        const user = await this.usersService.findOneById(id);

        if(!user.isActive) throw new UnauthorizedException(`EL usuario esta inactivo`);

        delete user.password;

        return user;
    }

    revalidateToken(user: User): AuthResponse{
        const token = this.getJwtToken(user.id);
        return {
            token,
            user
        }
    }

}
