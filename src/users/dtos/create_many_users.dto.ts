import { ArrayMinSize, ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create_user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyUsersDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(()=> CreateUserDto)
    @ApiProperty({
        required: true,
        type: "array",
        items: {
            type: "object"
        }
    }
)
    users: CreateUserDto[]
}