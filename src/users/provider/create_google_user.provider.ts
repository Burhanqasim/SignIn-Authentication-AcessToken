import {Injectable, RequestTimeoutException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../users.entity";
import {IGoogleUser} from "../interface/google_user.interface";

@Injectable()
export class CreateGoogleUserProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

   async createGoogleUser(googleUser: IGoogleUser){
       try {
           const newUser = await this.userRepository.create(googleUser);
           return await this.userRepository.save(newUser);
       } catch (error) {
           throw new RequestTimeoutException();
       }
   }
}
