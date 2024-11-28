import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MonitorType } from '../dto/create-monitor.dto';

@Entity('monitor')
export class Monitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column({
    comment: '类型, 1: 新增，2: 修改，3: 删除，4: 登录 ',
    type: 'enum',
    enum: [1, 2, 3, 4],
  })
  type: MonitorType;
  @Column()
  time: Date;

  @Column()
  module: string;
}
