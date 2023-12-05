import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  image: [
    {
      type: string;
      name: string;
      mimeType: string;
      image: Buffer;
      size: number;
    },
  ];
}

export const userSchema = SchemaFactory.createForClass(User);
