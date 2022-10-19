import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field( () => [ValidRoles], {nullable: true})
  @IsEnum(ValidRoles, {each: true})
  @IsOptional()
  roles?: ValidRoles[];
  
  @Field( () => Boolean, {nullable: true})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
