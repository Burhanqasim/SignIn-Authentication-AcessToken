import {forwardRef, Inject, RequestTimeoutException, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/provider/users.service";
import {SignInDto} from "../dtos/sign_in.dto";
import {HashProvider} from "./hash.provider";
import jwtConfig from "../config/jwt.config";
import type {ConfigType} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";


export class SignInProvider{
    constructor(
        @Inject(forwardRef(()=> UsersService))
        private readonly usersService: UsersService,
        private readonly hashProvider: HashProvider,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration : ConfigType<typeof jwtConfig>,
    ) {}

    async signIn(signInDto: SignInDto){
        let user = await this.usersService.findOneUserByEmail(signInDto.email);
        let isEqual = false;

        try{
            isEqual = await this.hashProvider.comparePassword(signInDto.password, user?.password);
        } catch (error) {
            throw new RequestTimeoutException(error)
        }
        if(!isEqual){
            throw new UnauthorizedException("Email or Password incorrect");
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
    }
}