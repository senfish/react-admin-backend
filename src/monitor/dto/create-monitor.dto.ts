import { IsNotEmpty, IsNumber } from 'class-validator';

export type MonitorType =
  /** 新增 */
  | 1
  /** 修改 */
  | 2
  /** 删除 */
  | 3
  /** 登录 */
  | 4;

export class CreateMonitorDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @IsNumber()
  type: MonitorType;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  module: string;
}
