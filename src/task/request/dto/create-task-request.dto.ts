import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyObject, IsObject, IsString } from "class-validator";

export class CreateTaskRequestDto {
  @ApiProperty({ name: 'message', description: 'Custom Message of the task to be processed', example: { greetings: "Hi this is my message you can add more properties" } })
  @IsObject()
  @IsNotEmptyObject()
  message: any
}
