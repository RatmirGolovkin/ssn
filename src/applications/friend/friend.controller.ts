import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserGuard } from 'src/guards/user.guards';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(UserGuard)
  @Get('list')
  getFriendList(@Request() req) {
    return this.friendService.getFriendList(req);
  }

  @UseGuards(UserGuard)
  @Post('send/:receiver')
  sandRequest(@Request() req, @Param('receiver') receiver: string) {
    return this.friendService.sandRequest(req, receiver);
  }

  @UseGuards(UserGuard)
  @Post('accept/:request')
  acceptRequest(@Request() req, @Param('request') requestId: string) {
    return this.friendService.acceptRequest(req, requestId);
  }

  @UseGuards(UserGuard)
  @Post('decline/:request')
  declineRequest(@Request() req, @Param('request') requestId: string) {
    return this.friendService.declineRequest(req, requestId);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Request() req, @Param('id') id: string) {
    return this.friendService.deleteFriend(req, id);
  }
}
