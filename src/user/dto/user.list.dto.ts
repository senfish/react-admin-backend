import { RoleType } from './register.dto';

export class UserListRequestDto {
  pageNum?: number;
  pageSize?: number;
}

export class UserList {
  id: number;
  username: string;
  role: RoleType;
  password: string;
  createTime: string;
  updateTime: string;
}

export class UpdateUserDto extends UserList {}

export class DeleteUserDto {
  id: number;
}
