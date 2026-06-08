import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create_user.dto";

export class PatchUserDto extends PartialType(CreateUserDto){

} 