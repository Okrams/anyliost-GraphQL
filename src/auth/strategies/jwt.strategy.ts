import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../../users/entities/user.entity';
import { AuthService } from "../auth.service";
import { JWTPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        private readonly configSevrice: ConfigService,
        private readonly authService: AuthService
    ){
        super({
            secretOrKey: configSevrice.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JWTPayload):Promise<User>{
        
        const {id} = payload;

        const user = await this.authService.validateuser(id);

        return user;
        
    }

}