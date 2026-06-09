import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {REQUEST_USER_KEY} from "../../constants/auth_constants";
import jwtConfig from "../../config/jwt.config";
import type {ConfigType} from "@nestjs/config";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
      private readonly jwtService: JwtService,
      @Inject(jwtConfig.KEY)
      private  readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    // extract request from the token
    const request : Request = context.switchToHttp().getRequest();
    // extract token from the header
    const token : string | undefined = this.extractTokenFromHeader(request);

    if(!token){
      throw  new UnauthorizedException();
    }
    // validate token
    console.log('VERIFY SECRET:', this.jwtConfiguration.secret);
    console.log('SIGN SECRET:', this.jwtConfiguration.secret);
    try {
      request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      console.log(request[REQUEST_USER_KEY]);
      console.log('PAYLOAD:', request[REQUEST_USER_KEY]);
    } catch (error) {
      console.log('JWT ERROR:', error);
      console.log('JWT VERIFY ERROR');
      console.error(error);
      throw error;
      throw  new UnauthorizedException();
    }

    return true;
  }

  // @ts-ignore
  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-ignore
    const [ _ , token] = request.headers.authorization?.split(" ") ?? [];
    return token;
  }
}
