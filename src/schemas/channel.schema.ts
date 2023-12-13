import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Channel {
  @Prop()
  name: string;

  @Prop()
  admin: string;

  @Prop()
  description: string;

  @Prop()
  image: [
    {
      imageType: string;
      name: string;
      mimetype: string;
      image: Buffer;
      size: number;
    },
  ];

  @Prop()
  members: [
    {
      user: string;
      userId: string;
    },
  ];

  @Prop()
  media: [
    {
      mediaType: string;
      postId: string;
      image: [
        {
          imageId: string;
        },
      ];
      author: string;
    },
  ];
}
export const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'User',
  },
  admin: {
    type: String,
    ref: 'User',
  },
  description: {
    type: String,
  },
  image: [
    {
      imageType: {
        type: String,
        enum: ['avatar', 'banner'],
        default: 'avatar',
      },
      name: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      image: {
        type: Buffer,
      },
      size: {
        type: Number,
      },
    },
  ],
  members: [
    {
      user: {
        type: String,
      },
      userId: {
        type: String,
        ref: 'User',
      },
    },
  ],
  media: [
    {
      mediaType: {
        type: String,
        enum: ['post'],
        default: 'post',
      },
      postId: {
        type: String,
        ref: 'Post',
      },
      image: [
        {
          imageId: {
            type: String,
          },
        },
      ],
      author: {
        type: String,
        ref: 'User',
      },
    },
  ],
});
