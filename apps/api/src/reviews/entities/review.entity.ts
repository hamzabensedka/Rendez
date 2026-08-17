import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../prisma/base.model';

@ObjectType()
export class Review extends BaseModel {
  @Field(() => String)
  comment: string;

  @Field(() => Int)
  rating: number;
}
