import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users/users.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      AuthModule,
    UsersModule,
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
  providers: [AppService],
})
export class AppModule {}
