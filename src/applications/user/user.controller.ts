import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/guards/user.guards';
import { RegisterDto } from 'src/dto/user/register.dto';
import { LoginDto } from 'src/dto/user/login.dto';
import { ChangePassDto } from 'src/dto/user/change-pass.dto';
import { ChangeEmailDto } from 'src/dto/user/change-email.dto';
import { ChangeLoginDto } from 'src/dto/user/change-login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get('get')
  getProfile(@Request() req) {
    return this.userService.get(req);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('uploadFile'))
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(UserGuard)
  @Put('change/password')
  changePassword(@Body() changePassDto: ChangePassDto, @Request() req) {
    return this.userService.changePassword(changePassDto, req);
  }

  @UseGuards(UserGuard)
  @Put('change/email')
  changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Request() req) {
    return this.userService.changeEmail(changeEmailDto, req);
  }

  @UseGuards(UserGuard)
  @Put('change/login')
  changeLogin(@Body() changeLoginDto: ChangeLoginDto, @Request() req) {
    return this.userService.changeLogin(changeLoginDto, req);
  }

  @UseGuards(UserGuard)
  @Post('change/profile/avatar')
  @UseInterceptors(FileInterceptor('uploadFile'))
  changeProfileAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.userService.changeAvatar(file, req);
  }

  @UseGuards(UserGuard)
  @Post('change/profile/banner')
  @UseInterceptors(FileInterceptor('uploadFile'))
  changeProfileBanner(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.userService.changeBanner(file, req);
  }

  @UseGuards(UserGuard)
  @Post('upload/file/:type')
  @UseInterceptors(FileInterceptor('uploadFile'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Param('type') type: string,
  ) {
    return this.userService.uploadImage(file, req, type);
  }

  @UseGuards(UserGuard)
  @Delete('delete')
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req);
  }

  @UseGuards(UserGuard)
  @Delete('delete/image/:type')
  deleteImage(@Request() req, @Param('type') type: string) {
    return this.userService.deleteImage(req, type);
  }
}
