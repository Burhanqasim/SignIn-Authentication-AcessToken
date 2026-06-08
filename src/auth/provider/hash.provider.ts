import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashProvider {
    abstract hashPassword(password: string) : Promise<string>;
    abstract comparePassword(password: string, encrypted: string | undefined) : Promise<boolean>;
}
