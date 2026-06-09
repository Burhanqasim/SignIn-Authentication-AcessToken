import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users/users.entity";
import {ConfigModule} from "@nestjs/config";
import JwtConfig from "./auth/config/jwt.config";
import {JwtModule} from "@nestjs/jwt";
import jwtConfig from "./auth/config/jwt.config";
import {APP_GUARD} from "@nestjs/core";
import {AccessTokenGuard} from "./auth/guard/access_token/access_token.guard";
import {AuthenticationGuard} from "./auth/guard/authentication/authentication.guard";

@Module({
  imports: [
      AuthModule,
    UsersModule,
      ConfigModule.forFeature(JwtConfig),
      JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      // load: [appConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports:[],
      inject: [],
      useFactory:()=>({
        type: 'postgres',
        entities: [User],
        synchronize: true,
        port: 5432,
        host: 'localhost',
        username: 'postgres',
        password: 'burhan123',
        database: 'nestjs_database',
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
      AccessTokenGuard,
  ],
})
export class AppModule {}
