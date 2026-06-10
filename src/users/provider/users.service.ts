import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateUsersProvider} from "./create_users.provider";
import {CreateManyUsersDto} from "../dtos/create_many_users.dto";
import {CreateUserDto} from "../dtos/create_user.dto";
import {UsersCreateManyProvider} from "./users-create-many.provider";
import {AuthService} from "../../auth/provider/auth.service";
import {GetUserParamsDto} from "../dtos/getUserParams.dto";
import {FindUserByEmailProvider} from "./find_user_by_email.provider";
import profileConfig from "../config/profile.config";
import ProfileConfig from "../config/profile.config";
import type {ConfigType} from "@nestjs/config";
import {FindOneUserByGoogleIdProvider} from "./find_one_user_by_google_id.provider";
import {CreateGoogleUserProvider} from "./create_google_user.provider";
import {IGoogleUser} from "../interface/google_user.interface";

@Injectable()
export class UsersService {
    constructor(
        private readonly createUsersProvider: CreateUsersProvider,
        private readonly usersCreateManyProvider: UsersCreateManyProvider,
        private  readonly  findUserByEmailProvider : FindUserByEmailProvider,
        @Inject(profileConfig.KEY)
        private readonly configType: ConfigType<typeof ProfileConfig>,
        @Inject(forwardRef(()=> AuthService))
        private  readonly authService: AuthService,
        private readonly findOneUserByGoogleIdProvider: FindOneUserByGoogleIdProvider,
        private readonly createGoogleUserProvider: CreateGoogleUserProvider,



    ) {
    }

    async findOneUserByEmail(email: string){
        return this.findUserByEmailProvider.findUserByEmail(email);
    }

    async createUser(createUsersDto: CreateUserDto) {
        return await this.createUsersProvider.createUser(createUsersDto);
    }

    async createManyUsers(createManyUsersDto: CreateManyUsersDto){
        return this.usersCreateManyProvider.createManyUsers(createManyUsersDto);
    }

    findAll(getUserParamsDto: GetUserParamsDto, size: number, page: number) {
        const id : number = getUserParamsDto.id;
        const isAuth = this.authService.isAuthenticated(id.toString());
        // console.log(this.configService.get("TEST_KEY"));
        // console.log(this.profileConfigData.profile_key)
        if(!isAuth){
            return [];
        }
        return [
            {"id": 1, "name" : "Burhan", "email": "burhan@gmail.com"},
            {"id": 2, "name" : "Kamran", "email": "kamran@gmail.com"},
            {"id": 3, "name" : "Zafar" , "email": "zafar@gmail.com" },
        ]
    }

    async findOneByGoogleId(googleId: string) {
        return await this.findOneUserByGoogleIdProvider.findOneByGoogleId(googleId);
    }

    async createGoogleUser(googleUser: IGoogleUser) {
        return await this.createGoogleUserProvider.createGoogleUser(googleUser);
    }


}
