import {forwardRef, Module} from '@nestjs/common';
import { HashProvider } from './provider/hash.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { AuthService } from './provider/auth.service';
import {UsersModule} from "../users/users.module";
import { AuthController } from './auth.controller';
import {SignInProvider} from "./provider/sign_in.provider";
import {ConfigModule} from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import {JwtModule} from "@nestjs/jwt";
import { GenerateTokenProvider } from './provider/generate-token.provider';



@Module({
  providers: [
      AuthService ,
    {
      provide : HashProvider,
      useClass : BcryptProvider
    },
    SignInProvider,
    GenerateTokenProvider,
  ],
  imports: [
      forwardRef(()=> UsersModule),
      ConfigModule.forFeature(jwtConfig),
      JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  exports: [AuthService, HashProvider],
  controllers: [AuthController],

})
export class AuthModule {}
