import {Body, Controller, Post} from '@nestjs/common';
import {GoogleAuthService} from "./provider/google_auth.service";
import {GoogleTokenDto} from "./dtos/google_token.dto";
import {Auth} from "../decorator/auth.decorator";
import {AuthType} from "../enum/auth_type.enum";


@Auth(AuthType.NONE)
@Controller('/auth/google-authentication')
export class GoogleAuthController {
    constructor(
        private readonly googleAuthService: GoogleAuthService,
    ) {}

    @Post()
    async createGoogleUser(@Body() googleTokenDto: GoogleTokenDto) {
        return this.googleAuthService.authenticate(googleTokenDto);
    }
}
