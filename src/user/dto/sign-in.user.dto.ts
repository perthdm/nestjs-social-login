import { IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  username: string;
}
