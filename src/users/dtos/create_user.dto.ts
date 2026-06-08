import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsOptional()
    lastName?: string;
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string ;
    @IsString()
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    //     message: "Password incorrect"
    // })
    password: string;
}