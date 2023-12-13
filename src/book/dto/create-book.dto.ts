import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsOptional()
  description: string;

  @IsOptional()
  author: string;
}
