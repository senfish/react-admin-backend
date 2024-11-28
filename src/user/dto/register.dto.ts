import {
  isNotEmpty,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsNumber,
} from 'class-validator';

export type RoleType = 1 | 2 | 3;

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  password?: string;

  @IsNotEmpty()
  @IsNumber()
  role: RoleType;
}
