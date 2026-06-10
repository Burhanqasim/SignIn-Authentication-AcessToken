import {forwardRef, Module} from '@nestjs/common';
import { CreateUsersProvider } from './provider/create_users.provider';
import { UsersService } from './provider/users.service';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {UsersCreateManyProvider} from "./provider/users-create-many.provider";
import {UsersController} from "./users.controller";
import { FindUserByEmailProvider } from './provider/find_user_by_email.provider';
import {ConfigModule} from "@nestjs/config";
import profileConfig from "./config/profile.config";
import jwtConfig from "../auth/config/jwt.config";
import {JwtModule} from "@nestjs/jwt";
import { FindOneUserByGoogleIdProvider } from './provider/find_one_user_by_google_id.provider';
import { CreateGoogleUserProvider } from './provider/create_google_user.provider';

@Module({
  controllers: [UsersController],
  providers: [CreateUsersProvider, UsersService, UsersCreateManyProvider, FindUserByEmailProvider, FindOneUserByGoogleIdProvider, CreateGoogleUserProvider],
  exports: [UsersService],
  imports: [
      forwardRef(()=> AuthModule),
      TypeOrmModule.forFeature([User]),
      ConfigModule.forFeature(profileConfig),
      ConfigModule.forFeature(jwtConfig),
      JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
