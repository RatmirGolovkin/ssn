import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UserGuard } from 'src/guards/user.guards';
import { CreateChannelDto } from 'src/dto/channel/create.dto';
import { ChangeNameChannelDto } from 'src/dto/channel/change-name.dto';
import { ChangeDescriptionChannelDto } from 'src/dto/channel/change-description.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/:id')
  get(@Param('id') id: string) {
    return this.channelService.get(id);
  }

  @UseGuards(UserGuard)
  @Post('create')
  create(@Request() req, @Body() createChannelDto: CreateChannelDto) {
    return this.channelService.createChannel(req, createChannelDto);
  }

  @UseGuards(UserGuard)
  @Post(':id/update/description')
  updateDescription(
    @Param('id') id: string,
    @Body() updateDescription: ChangeDescriptionChannelDto,
    @Request() req,
  ) {
    return this.channelService.updateDescription(id, updateDescription, req);
  }

  @UseGuards(UserGuard)
  @Post(':id/update/name')
  updateName(
    @Param('id') id: string,
    @Body() updateName: ChangeNameChannelDto,
    @Request() req,
  ) {
    return this.channelService.updateName(id, updateName, req);
  }

  @UseGuards(UserGuard)
  @Post(':id/upload/profile/:type')
  @UseInterceptors(FileInterceptor('uploadFile'))
  uploadProfileImage(
    @Param('id') id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.channelService.uploadProfileImage(id, type, file, req);
  }

  @UseGuards(UserGuard)
  @Delete(':id/delete')
  deleteChannel(@Param('id') id: string, @Request() req) {
    return this.channelService.deleteChannel(id, req);
  }
}
