import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetUserParamsDto {
    @ApiPropertyOptional({
        description: "Fetch specific user by userId",
        example: "10"
    })
    @IsInt()
    // @IsOptional()
    @Type(()=> Number)
    id: number;
}