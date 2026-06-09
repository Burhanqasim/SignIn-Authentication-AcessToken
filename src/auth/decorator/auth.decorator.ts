import { SetMetadata } from '@nestjs/common';
import {AUTH_TYPE_KEY} from "../constants/auth_constants";
import {AuthType} from "../enum/auth_type.enum";

export const Auth = (...args: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, args);
