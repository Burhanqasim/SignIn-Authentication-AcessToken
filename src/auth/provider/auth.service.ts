import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/provider/users.service";
import {User} from "../../users/users.entity";
import {SignInProvider} from "./sign_in.provider";
import {SignInDto} from "../dtos/sign_in.dto";
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import type {ConfigType} from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=> UsersService))
        private readonly usersService: UsersService,
        private readonly signInProvider: SignInProvider,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration : ConfigType<typeof jwtConfig>,

    ) {
    }
    isAuthenticated(id?: string){
        return !!id;
    }

    async signIn(signInDto: SignInDto){
        let user =  await this.usersService.findOneUserByEmail(signInDto.email);
        if(!user){
            throw new UnauthorizedException("Email or password incorrect");
        }
        // @ts-ignore
        const access_token = await this.jwtService.signAsync({
            sub: user?.id,
            email: signInDto.email,
        }, {
            audience: this.jwtConfiguration.audience,
            secret: this.jwtConfiguration.secret,
            issuer: this.jwtConfiguration.issuer,
            expiresIn: this.jwtConfiguration.accessTokenTTL
        })
        return { access_token };
        return {token: "Dummy_Token"}
    }

    // async signIn(signInDto:SignInDto) {
    //     return this.signInProvider.signIn(signInDto);
    // }
}
