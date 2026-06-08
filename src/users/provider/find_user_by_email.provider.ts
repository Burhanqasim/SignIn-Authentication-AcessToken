import {Injectable, RequestTimeoutException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users.entity";
import {Repository} from "typeorm";

@Injectable()
export class FindUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    // @ts-ignore
    public async findUserByEmail(email : string): Promise<User | null>{
       let user : User | null = null;
        try{
            user = await  this.userRepository.findOneBy({email});
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: "Could not fetch user by email"
            });
        }
        if(!user){
            throw new UnauthorizedException("User not found");
        }
         return user;
    }

}
