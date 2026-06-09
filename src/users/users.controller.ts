import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { GetUserParamsDto } from './dtos/getUserParams.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create_many_users.dto';
import {UsersService} from "./provider/users.service";
import {AccessTokenGuard} from "../auth/guard/access_token/access_token.guard";
import {AuthType} from "../auth/enum/auth_type.enum";
import {Auth} from "../auth/decorator/auth.decorator";


@Controller('users')
@ApiTags("Users")
export class UsersController {
  constructor (private readonly userService: UsersService) {}

  @Auth(AuthType.NONE)
  @Post()
  createUser(@Body() createuserdto: CreateUserDto){
    return this.userService.createUser(createuserdto)
  }

  @UseGuards(AccessTokenGuard)
  @Post("create-many")
  createManyUser(@Body() createManyUserDto: CreateManyUsersDto){
    return this.userService.createManyUsers(createManyUserDto);
  }

  @Patch()
  updateUser(@Body() patchuserdto: PatchUserDto) {
    console.log(patchuserdto);
    return "Update User"
  }


  @Get(":id")
  @ApiOperation({summary: "Fetch a register user by Id"})
  @ApiResponse({
    status: 200,
    description: "Fetch user successfully"
  })
  @ApiQuery({
    name: "size",
    type: "number",
    description: "Fetch number of user as per size",
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: "page",
    type: "number",
    description: "The number of page that you want to return an api",
    required: false,
    example: 1
  })
  getAllUser(
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query("size", new DefaultValuePipe(20), ParseIntPipe) size: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
) {
    return this.userService.findAll(getUserParamsDto, size ,page);
  }

}
