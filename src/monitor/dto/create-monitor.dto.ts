import { IsNotEmpty, IsNumber } from 'class-validator';

export type MonitorType =
  /** 新增 */
  | 1
  /** 修改 */
  | 2
  /** 删除 */
  | 3
  /** 登录 */
  | 4
  /** 查看文章 */
  | 5;
export class CreateMonitorDto {
  user: string;

  @IsNotEmpty()
  @IsNumber()
  type: MonitorType;

  time: string;

  @IsNotEmpty()
  module: string;
}
