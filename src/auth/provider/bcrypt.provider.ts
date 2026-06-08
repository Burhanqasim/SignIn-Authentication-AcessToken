import { Injectable } from '@nestjs/common';
import {HashProvider} from "./hash.provider";
import * as bcrypt from "bcrypt";
import {asyncWrapProviders} from "node:async_hooks";

@Injectable()
export class BcryptProvider implements HashProvider{
    comparePassword(password: string, encrypted: string | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
   async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(5);
        return await bcrypt.hash(password , salt);
    }

}
