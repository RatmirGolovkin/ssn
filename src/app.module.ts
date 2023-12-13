import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './applications/user/user.module';
import { FriendModule } from './applications/friend/friend.module';
import { ChannelModule } from './app-public/channel/channel.module';
import { GroupModule } from './app-public/group/group.module';
import { PostModule } from './applications/post/post.module';
import { SubModule } from './applications/sub/sub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FriendModule,
    ChannelModule,
    GroupModule,
    PostModule,
    SubModule,
  ],
})
export class AppModule {}
