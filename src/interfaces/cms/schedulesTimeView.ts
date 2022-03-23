import {
  AssessmentStatus,
  ScheduleClassType,
  ScheduleStatus,
  ScheduleViewType,
  TimeBoundary,
} from '../../types';

import { BaseRequest } from './base';

export interface PostSchedulesTimeViewListRequest extends BaseRequest {
  anytime?: boolean;
  class_ids?: string[];
  class_types?: ScheduleClassType[];
  due_at_eq?: number;
  end_at_le?: number;
  order_by?: string;
  page_size?: number;
  page?: number;
  program_ids?: string[];
  school_ids?: string[];
  start_at_ge?: number;
  subject_ids?: string[];
  teacher_ids?: string[];
  time_at: number;
  time_boundary?: TimeBoundary;
  time_zone_offset: number;
  view_type: ScheduleViewType;
  with_assessment_status?: boolean;
}

export interface SchedulesTimeViewListItem {
  assessment_status: AssessmentStatus;
  class_id: string;
  class_type: ScheduleClassType;
  created_at: number;
  due_at: number;
  end_at: number;
  id: string;
  is_home_fun: boolean;
  is_repeat: boolean;
  lesson_plan_id: string;
  start_at: number;
  status: ScheduleStatus;
  title: string;
}

export interface PostSchedulesTimeViewListResponse {
  data: SchedulesTimeViewListItem[];
  total: number;
}
