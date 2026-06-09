import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import type {ConfigType} from "@nestjs/config";
import {User} from "../../users/users.entity";
import {ref} from "joi";

@Injectable()
export class GenerateTokenProvider {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    ) {}

    public async signToken<T>(
        userId: number,
        expirationTime: number,
        payLoad: T,
    ){
        return  await this.jwtService.signAsync({
            sub: userId,
            ...payLoad,
        }, {
            audience: this.jwtConfiguration.audience,
            secret: this.jwtConfiguration.secret,
            issuer: this.jwtConfiguration.issuer,
            expiresIn: expirationTime,
        })
    }


    public async generateToken(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            await this.signToken(user.id, this.jwtConfiguration.accessTokenTTL, {
                email: user.email,
            }),
            await this.signToken(user.id, this.jwtConfiguration.accessRefreshTTL, {
                email: user.email,
            })
        ]);
        return {
            "Access Token": accessToken,
            "Refresh Token": refreshToken
        }

    }
}
