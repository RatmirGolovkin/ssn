import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Friend {
  @Prop()
  userId: string;

  @Prop()
  user: string;

  @Prop()
  friends: [
    {
      user: string;
      userId: string;
    },
  ];
}

export const friendSchema = SchemaFactory.createForClass(Friend);
