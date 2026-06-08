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

@Module({
  controllers: [UsersController],
  providers: [CreateUsersProvider, UsersService, UsersCreateManyProvider, FindUserByEmailProvider],
  exports: [UsersService],
  imports: [
      forwardRef(()=> AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
