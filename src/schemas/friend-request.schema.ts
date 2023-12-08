import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FriendRequest {
  @Prop()
  sander: string;

  @Prop()
  receiver: string;

  @Prop()
  status: string;
}

export const reqSchema = SchemaFactory.createForClass(FriendRequest);
