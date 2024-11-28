import { MonitorType } from './create-monitor.dto';

export class MonitorListDto {
  pageNum?: number;
  pageSize?: number;
  user?: string;
  type?: MonitorType;
  time?: string[];
}
