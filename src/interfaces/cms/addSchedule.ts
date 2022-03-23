import {
  RepeatEndType,
  ScheduleClassType,
  ScheduleRepeatType,
  ScheduleViewType,
} from '../../types';

import { BaseRequest } from './base';

export interface RepeatEnd {
  after_count: number;
  after_time: number;
  type: RepeatEndType;
}

export interface ScheduleRepeatDetail {
  interval?: number;
  end?: RepeatEnd;
  on?: string[];
  on_date_day?: number;
  on_type?: ScheduleViewType;
  on_week?: string;
  on_week_seq?: string;
}

export interface ScheduleRepeat {
  type?: ScheduleRepeatType;
  daily?: ScheduleRepeatDetail;
  weekly?: ScheduleRepeatDetail;
  monthly?: ScheduleRepeatDetail;
  yearly?: ScheduleRepeatDetail;
}

export interface AddScheduleRequest extends BaseRequest {
  attachment_path: string;
  attachment?: { id: string; name: string };
  class_id: string;
  class_roster_student_ids: string[];
  class_roster_teacher_ids: string[];
  class_type: ScheduleClassType;
  description: string;
  due_at: number;
  end_at: number;
  is_all_day: boolean;
  is_force: boolean;
  is_home_fun: boolean;
  is_repeat: boolean;
  lesson_plan_id: string;
  org_id: string;
  outcome_ids: string[];
  participants_student_ids: string[];
  participants_teacher_ids: string[];
  program_id: string;
  subject_id: string;
  repeat: ScheduleRepeat;
  start_at: number;
  subject_ids: string[];
  time_zone_offset: number;
  title: string;
  teacher_ids: string[];
}

export interface AddScheduleResponse {
  data: string;
  label: string;
}
