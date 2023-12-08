import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { FriendRequest } from 'src/schemas/friend-request.schema';
import { Friend } from 'src/schemas/friend.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(FriendRequest.name)
    private readonly requestModel: Model<FriendRequest>,
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  async getFriendList(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findFriends = await this.friendModel.findOne({ userId: findUser.id });

    if (!findFriends) {
      return 'Your friend list is empty!';
    }

    return {
      user: findUser.login,
      friends: findFriends.friends,
    };
  }

  async sandRequest(req, receiver: string) {
    const findSander = await this.userModel.findOne({ _id: req.user.id });

    if (!findSander) {
      throw new NotFoundError('User not found!');
    }

    const findReceiver = await this.userModel.findOne({ _id: receiver });

    if (!findReceiver) {
      throw new NotFoundError('Receiver is not found!');
    }

    const existedRequest = await this.requestModel.findOne({
      $and: [{ sander: findSander.id }, { receiver: findReceiver.id }],
    });

    if (existedRequest?.status === 'accepted') {
      const findExistedFriend = await this.friendModel.findOne({
        userId: findReceiver.id,
      });

      if (findExistedFriend) {
        const arr = findExistedFriend.friends;

        const find = arr.find((arr) => arr.userId === findSander.id);

        if (find) {
          throw new Error(
            'This request is alredy been accepted. Check your friend list!',
          );
        }
      }
    }

    if (existedRequest?.status === 'pending') {
      return 'Request already existed!';
    }

    const findExistedFriend = await this.friendModel.findOne({
      userId: findSander.id,
    });

    const arr = findExistedFriend?.friends;

    const existedFriend = arr?.find((arr) => arr.userId === findReceiver.id);

    if (existedFriend) {
      return 'This user alredy in your friend list!';
    }

    const request = {
      sander: findSander.id,
      receiver: findReceiver.id,
      status: 'pending',
    };

    const save = await this.requestModel.create(request);

    return {
      message: 'Succsess!',
      request: save,
    };
  }

  async acceptRequest(req, requestId: string) {
    const receiver = await this.userModel.findOne({ _id: req.user.id });

    if (!receiver) {
      throw new NotFoundError('User not found!');
    }

    const findRequest = await this.requestModel.findOne({ _id: requestId });

    if (!findRequest) {
      throw new Error('User not found!');
    }

    if (findRequest.status !== 'pending') {
      throw new Error('This request is alredy accepted or declined!');
    }

    if (findRequest.receiver !== receiver.id) {
      throw new Error('Request error!');
    }

    if (findRequest.sander === receiver.id) {
      throw new Error('Request error. Sander!');
    }

    const sander = await this.userModel.findOne({ _id: findRequest.sander });

    if (!sander) {
      throw new NotFoundError('Sander not found!');
    }

    const findReceiverFriend = await this.friendModel.findOne({
      userId: receiver.id,
    });

    if (findReceiverFriend) {
      const receiverArr = findReceiverFriend.friends;

      const receiverObj = {
        user: sander.login,
        userId: sander.id,
      };

      receiverArr.push(receiverObj);

      await this.friendModel.findOneAndUpdate(
        { _id: findReceiverFriend.id },
        { friends: receiverArr },
        { upsert: true, new: true },
      );
    } else {
      const payload = {
        userId: receiver.id,
        user: receiver.login,
        friends: [
          {
            user: sander.login,
            userId: sander.id,
          },
        ],
      };

      await this.friendModel.create(payload);
    }

    const findSanderFriend = await this.friendModel.findOne({
      userId: sander.id,
    });

    if (findSanderFriend) {
      const sanderArr = findSanderFriend.friends;

      const sanderObj = {
        user: sander.login,
        userId: sander.id,
      };

      sanderArr.push(sanderObj);

      await this.friendModel.findOneAndUpdate(
        { _id: findSanderFriend.id },
        { friends: sanderObj },
        { upsert: true, new: true },
      );
    } else {
      const payload = {
        userId: sander.id,
        user: sander.login,
        friends: [
          {
            user: receiver.login,
            userId: receiver.id,
          },
        ],
      };

      await this.friendModel.create(payload);
    }

    await this.requestModel.findOneAndUpdate(
      { _id: requestId },
      { status: 'accepted' },
      { upsert: true, new: true },
    );

    return {
      message: 'Success!',
    };
  }

  async declineRequest(req, requestId: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const findRequest = await this.requestModel.findOne({ _id: requestId });

    if (!findRequest) {
      throw new NotFoundError('Request not found!');
    }

    if (findRequest.receiver !== findUser.id) {
      throw new Error('You dont have access!');
    }

    if (findRequest?.status === 'accepted') {
      throw new Error('This requet alredy accepted');
    }

    const deleteRequest = await this.requestModel.findOneAndDelete({
      _id: findRequest.id,
    });

    return {
      message: 'Succsess!',
      request: deleteRequest,
    };
  }

  async deleteFriend(req, id: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const friend = await this.friendModel.findOne({ userId: id });

    if (!friend) {
      throw new NotFoundError('Friend not found!');
    }

    const userFriends = await this.friendModel.findOne({ userId: findUser.id });

    if (!userFriends) {
      return 'Your friend list is empty!';
    }

    const userArr = userFriends?.friends;

    userArr.splice(userArr.findIndex((arr) => arr.userId === friend.userId));

    const arr = friend?.friends;

    arr.splice(arr.findIndex((arr) => arr.userId === findUser.id));

    const updateUser = await this.friendModel.findOneAndUpdate(
      { userId: findUser.id },
      { friends: userArr },
      { upsert: true, new: true },
    );

    await this.friendModel.findOneAndUpdate(
      { userId: friend.userId },
      { friends: arr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      user: findUser.login,
      friends: updateUser.friends,
    };
  }
}
