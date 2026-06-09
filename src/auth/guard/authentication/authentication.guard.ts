import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthType} from "../../enum/auth_type.enum";
import {AccessTokenGuard} from "../access_token/access_token.guard";
import {Reflector} from "@nestjs/core";
import {AUTH_TYPE_KEY} from "../../constants/auth_constants";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType: AuthType = AuthType.BEARER;

  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
      private readonly accessTokenGuard: AccessTokenGuard,
      private readonly reflector: Reflector,
  ) {
    this.authTypeGuardMap = {
      [AuthType.BEARER]: this.accessTokenGuard,
      [AuthType.NONE]: {
        canActivate: () => true,
      },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(
        AUTH_TYPE_KEY,
        [context.getHandler(), context.getClass()]) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type: AuthType)=> this.authTypeGuardMap[type]);

    for(const instance of guards){
      try {
        const canActivate = await instance.canActivate(context);
        if(canActivate) {
          return true;
        }
      } catch (error) {
        console.log(`guards ${instance.constructor.name} failed`)
        console.error(error);
      }
    }
    console.log({ authTypes });
    throw new UnauthorizedException();
  }
}