import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/user.schema';
import { FriendRequest, reqSchema } from 'src/schemas/friend-request.schema';
import { Friend, friendSchema } from 'src/schemas/friend.schema';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: FriendRequest.name, schema: reqSchema },
      { name: Friend.name, schema: friendSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPERIENCE') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
