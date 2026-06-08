import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {AuthService} from "./provider/auth.service";
import {SignInDto} from "./dtos/sign_in.dto";
import {User} from "../users/users.entity";

@Controller('auth')
export class AuthController {
    constructor(private  readonly  authService: AuthService) {}

    // @ts-ignore
    // @ts-ignore
    @Post('sign_in')
    @HttpCode(200)
    public async singIn(@Body() signInDto: SignInDto){
        return await  this.authService.signIn(<User>signInDto);
    }

}
