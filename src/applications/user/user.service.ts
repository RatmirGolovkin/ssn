import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/user/register.dto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/user/login.dto';
import { NotFoundError } from 'rxjs';
import { ChangePassDto } from 'src/dto/user/change-pass.dto';
import { ChangeEmailDto } from 'src/dto/user/change-email.dto';
import { ChangeLoginDto } from 'src/dto/user/change-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async get() {}

  async register(registerDto: RegisterDto) {
    const existedUser = await this.userModel.findOne({
      $or: [{ login: registerDto.login }, { email: registerDto.email }],
    });

    if (existedUser) {
      return 'This user login or email is already in use!';
    }

    const hash = bcrypt.hashSync(registerDto.password, 10);
    registerDto.password = hash;

    const payload = {
      login: registerDto.login,
      email: registerDto.email,
      password: registerDto.password,
      image: [],
    };

    const user = await this.userModel.create(payload);

    return {
      message: 'Succsess!',
      user: user.login,
      id: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const existedUser = await this.userModel.findOne({ login: loginDto.login });

    if (!existedUser) {
      throw new NotFoundError('User not found!');
    }

    const comparePassword = bcrypt.compare(
      loginDto.password,
      existedUser.password,
    );

    if (!comparePassword) {
      throw new Error('Incorrect password!');
    }

    const payload = { id: existedUser.id };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: `User: '${existedUser.login}', successfully authorized!`,
      email: existedUser.email,
      access_token: access_token,
    };
  }

  async changePassword(changePassDto: ChangePassDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    if (findUser.login !== changePassDto.login) {
      throw new Error('Login error!');
    }

    if (changePassDto.oldPassword === changePassDto.newPassword) {
      throw new Error('Please change password!');
    }

    const compareOldPassword = bcrypt.compare(
      findUser.password,
      changePassDto.oldPassword,
    );

    if (!compareOldPassword) {
      throw new Error('Incorrect old password!');
    }

    const hashNewPassword = bcrypt.hashSync(changePassDto.newPassword, 10);

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser.id },
      { password: hashNewPassword },
      { upsert: true, new: true },
    );

    return {
      message: `The password for '${update.login}', successfully updated!`,
      login: update.login,
      email: update.email,
    };
  }

  async changeEmail(changeEmailDto: ChangeEmailDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    if (changeEmailDto.oldEmail === changeEmailDto.newEmail) {
      throw new Error('Change new email!');
    }

    if (findUser.email !== changeEmailDto.oldEmail) {
      return 'Old password error!';
    }

    if (findUser.email === changeEmailDto.newEmail) {
      return 'You alredy use this email!';
    }

    const comparePassword = bcrypt.compare(
      findUser.password,
      changeEmailDto.password,
    );

    if (!comparePassword) {
      return 'Incorrect password!';
    }

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser },
      { email: changeEmailDto.newEmail },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      user: findUser.login,
      newEmail: update.email,
    };
  }

  async changeLogin(changeLoginDto: ChangeLoginDto, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    if (changeLoginDto.oldLogin === changeLoginDto.newLogin) {
      return 'Change new login!';
    }

    if (findUser.login !== changeLoginDto.oldLogin) {
      throw new Error('Login error!');
    }

    if (findUser.login === changeLoginDto.newLogin) {
      return 'Change new login!';
    }

    const existLogin = await this.userModel.findOne({
      login: changeLoginDto.newLogin,
    });

    if (existLogin) {
      throw new Error('This login alredy in use!');
    }

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser.id },
      { login: changeLoginDto.newLogin },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      user: update.login,
      oldLogin: changeLoginDto.oldLogin,
    };
  }

  async changeAvatar(file: Express.Multer.File, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const type = 'avatar';

    if (findUser.image.length <= 0) {
      return this.uploadImage(file, req, type);
    }

    const arr = findUser.image;

    if (arr.length >= 1) {
      arr.splice(arr.findIndex((arr) => arr.type === 'avatar'));
    }

    const obj = {
      type: 'avatar',
      name: file.originalname,
      mimeType: file.mimetype,
      image: file.buffer,
      size: file.size,
    };

    arr.push(obj);

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser.id },
      { image: arr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess',
      user: update,
    };
  }

  async changeBanner(file: Express.Multer.File, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const type = 'banner';

    if (findUser.image.length <= 0) {
      return this.uploadImage(file, req, type);
    }

    const arr = findUser.image;

    if (arr.length >= 1) {
      arr.splice(arr.findIndex((arr) => arr.type === 'banner'));
    }

    const obj = {
      type: 'banner',
      name: file.originalname,
      mimeType: file.mimetype,
      image: file.buffer,
      size: file.size,
    };

    arr.push(obj);

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser.id },
      { image: arr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess',
      user: update,
    };
  }

  async uploadImage(file: Express.Multer.File, req, type: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    if (findUser.image.length > 0) {
      return this.distributor(file, req);
    }

    if (type === 'avatar') {
      const arr = findUser.image;

      const obj = {
        type: 'avatar',
        name: file.originalname,
        mimeType: file.mimetype,
        image: file.buffer,
        size: file.size,
      };

      arr.push(obj);

      const update = await this.userModel.findOneAndUpdate(
        { _id: findUser.id },
        { image: arr },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        user: update,
      };
    }

    if (type === 'banner') {
      const arr = findUser.image;

      const obj = {
        type: 'banner',
        name: file.originalname,
        mimeType: file.mimetype,
        image: file.buffer,
        size: file.size,
      };

      arr.push(obj);

      const update = await this.userModel.findOneAndUpdate(
        { _id: findUser.id },
        { image: arr },
        { upsert: true, new: true },
      );

      return {
        message: 'Succsess!',
        user: update,
      };
    }

    throw new Error('Type error! Something wrong with images type!');
  }

  async distributor(file: Express.Multer.File, req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const arr = findUser.image;

    const findAvatar = arr.find((arr) => arr.type === 'avatar');

    if (findAvatar) {
      return this.changeAvatar(file, req);
    }

    const findBanner = arr.find((arr) => arr.type === 'banner');

    if (findBanner) {
      return this.changeBanner(file, req);
    }

    throw new Error('Type error! Something wrong with images type!');
  }

  async deleteUser(req) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const deleteUser = await this.userModel.findOneAndDelete({
      _id: findUser.id,
    });

    return {
      message: 'Succsess!',
      user: deleteUser,
    };
  }

  async deleteImage(req, type: string) {
    const findUser = await this.userModel.findOne({ _id: req.user.id });

    if (!findUser) {
      throw new NotFoundError('User not found!');
    }

    const arr = findUser.image;

    arr.splice(arr.findIndex((arr) => arr.type === type));

    const update = await this.userModel.findOneAndUpdate(
      { _id: findUser.id },
      { image: arr },
      { upsert: true, new: true },
    );

    return {
      message: 'Succsess!',
      user: update.login,
      images: update.image,
    };
  }
}
