import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../prisma/base.model';

@ObjectType()
export class Payment extends BaseModel {
  @Field(() => String)
  status: string;

  @Field(() => String)
  method: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}