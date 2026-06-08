import {BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException} from '@nestjs/common';
import {CreateUserDto} from "../dtos/create_user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../users.entity";
import {HashProvider} from "../../auth/provider/hash.provider";

@Injectable()
export class CreateUsersProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => HashProvider))
        private readonly hashProvider: HashProvider,

    ) {
    }
    async createUser(createUserDto: CreateUserDto) {
        let userExist = undefined;
        try {
            // @ts-ignore
            userExist = await this.userRepository.findOne({
                where: { email: createUserDto.email },
            });
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request try later',
                {
                    description: 'Error connecting to the database.',
                },
            );
        }

        if (userExist) {
            throw new BadRequestException('User with this email already exists.');
        }

        let newUser = this.userRepository.create({
            ...createUserDto,
            password: await this.hashProvider.hashPassword(createUserDto.password),
        });

        try {
            newUser = await this.userRepository.save(newUser);
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request try later',
                {
                    description: 'Error connecting to the database.',
                },
            );
        }
        return newUser;
    }
}
