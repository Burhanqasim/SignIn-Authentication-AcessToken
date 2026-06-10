import {forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import jwtConfig from "../../config/jwt.config";
import type {ConfigType} from "@nestjs/config";
import {UsersService} from "../../../users/provider/users.service";
import {GenerateTokenProvider} from "../../provider/generate-token.provider";
import {OAuth2Client} from "google-auth-library";
import {GoogleTokenDto} from "../dtos/google_token.dto";
import {IGoogleUser} from "../../../users/interface/google_user.interface";

@Injectable()
export class GoogleAuthService implements OnModuleInit{
    private oAuthClinet: OAuth2Client;
    constructor(
        private readonly jwtService : JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        @Inject(forwardRef(()=> UsersService))
        private readonly userService: UsersService,
        private readonly generateTokenProvider: GenerateTokenProvider,
    ) {
    }

    onModuleInit() {
        console.log('CLIENT ID:', this.jwtConfiguration.googleClientId);
       this.oAuthClinet = new OAuth2Client(
           this.jwtConfiguration.googleClientId,
           this.jwtConfiguration.googleClientSecret,
       )
    }

    async authenticate(googleTokenDto: GoogleTokenDto) {
        try {
            const tokenTicket = await this.oAuthClinet.verifyIdToken({
                idToken: googleTokenDto.token,
            });
            console.log({tokenTicket})
            const payload = tokenTicket.getPayload();
            console.log(payload);
            if (!payload) {
                throw new Error('No payload found');
            }
            const {
                email,
                sub: googleId,
                given_name: firstName,
                family_name: lastName
            } = payload;

            const user = await this.userService.findOneUserByEmail(googleId);
            if(user){
                return await this.generateTokenProvider.generateToken(user);
            }
            const newUser = await this.userService.createGoogleUser({
                firstName,
                lastName,
                email,
                googleId,
            } as IGoogleUser);
            return await this.generateTokenProvider.generateToken(newUser);

        } catch (error) {
            throw  new UnauthorizedException();
        }
    }
}
