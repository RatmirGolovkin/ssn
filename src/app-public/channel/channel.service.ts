import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { ChangeDescriptionChannelDto } from 'src/dto/channel/change-description.dto';
import { ChangeNameChannelDto } from 'src/dto/channel/change-name.dto';

import { CreateChannelDto } from 'src/dto/channel/create.dto';
import { Channel } from 'src/schemas/channel.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Channel.name)
    private readonly channelModel: Model<Channel>,
  ) {}

  async get(id: string) {
    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    return findChannel;
  }

  async createChannel(req, createChannelDto: CreateChannelDto) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found');
    }

    const findChannel = await this.channelModel.findOne({
      name: createChannelDto.name,
    });

    if (findChannel) {
      return 'This channel name is alredy existed!';
    }

    const membersArr = [];

    const member = {
      user: findUser.login,
      userId: findUser.id,
    };

    membersArr.push(member);

    const payload = {
      name: createChannelDto.name,
      admin: findUser.id,
      description: createChannelDto.description,
      image: [],
      memders: membersArr,
      media: [],
    };

    const save = await this.channelModel.create(payload);

    return {
      message: 'Succsess!',
      channel: save,
    };
  }

  async updateDescription(
    id,
    updateDescription: ChangeDescriptionChannelDto,
    req,
  ) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findChannel.admin !== findUser.id) {
      throw new Error('Access error!');
    }

    const update = await this.channelModel.findOneAndUpdate(
      { _id: findChannel.id },
      { description: updateDescription.description },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      channel: update,
      description: update.description,
    };
  }

  async updateName(id: string, updateName: ChangeNameChannelDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findChannel.admin !== findUser.id) {
      throw new Error('Access error!');
    }

    const update = await this.channelModel.findOneAndUpdate(
      { _id: findChannel.id },
      { name: updateName.name },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      channel: update,
      name: update.name,
    };
  }

  async uploadProfileImage(
    id: string,
    type: string,
    file: Express.Multer.File,
    req,
  ) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findChannel.admin !== findUser.id) {
      throw new Error('Access error!');
    }

    if (type === 'avatar') {
      const arr = findChannel.image;

      const obj = {
        imageType: 'avatar',
        name: file.originalname,
        mimetype: file.mimetype,
        image: file.buffer,
        size: file.size,
      };

      arr.push(obj);

      const update = await this.channelModel.findOneAndUpdate(
        { _id: findChannel.id },
        { image: arr },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        image: update.image,
        channel: update,
      };
    }

    if (type === 'banner') {
      const arr = findChannel.image;

      const obj = {
        imageType: 'banner',
        name: file.originalname,
        mimetype: file.mimetype,
        image: file.buffer,
        size: file.size,
      };

      arr.push(obj);

      const update = await this.channelModel.findOneAndUpdate(
        { _id: findChannel.id },
        { image: arr },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        image: update.image,
        channel: update,
      };
    }

    throw new Error('Upload file error');
  }

  async deleteChannel(id: string, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findChannel = await this.channelModel.findOne({ _id: id });

    if (!findChannel) {
      throw new NotFoundError('Channel not found!');
    }

    if (findChannel.admin !== findUser.id) {
      throw new Error('Access error');
    }

    const deleteChannel = await this.channelModel.findOneAndDelete({
      _id: findChannel.id,
    });

    return {
      message: 'Succsess!',
      channel: deleteChannel,
    };
  }
}
