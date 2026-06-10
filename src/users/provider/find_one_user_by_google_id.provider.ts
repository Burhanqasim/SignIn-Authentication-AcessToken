import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users.entity";
import {Repository} from "typeorm";

@Injectable()
export class FindOneUserByGoogleIdProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneByGoogleId(googleId: string) : Promise<User | null> {
        return await this.userRepository.findOneBy({ googleId });
    }
}
