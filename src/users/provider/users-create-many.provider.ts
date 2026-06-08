import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create_many_users.dto';
import { User } from '../users.entity';

@Injectable()
export class UsersCreateManyProvider {
    constructor(private readonly dataSource : DataSource){}

    async createManyUsers(createManyUsersDto: CreateManyUsersDto){
        let newUserList : User[] = [];
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException("Unable to connect to the database");
        }
        try {
            for(let users of createManyUsersDto.users){
                let newUser = queryRunner.manager.create(User, users);
                let result = await queryRunner.manager.save(newUser);
                newUserList.push(result);
            }
            await queryRunner.commitTransaction();
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw new ConflictException("Could not complete the transaction", {
                description: String(error),
            });
        } finally {
           await queryRunner.release();
        }
        return {newUserList}
    }
}
