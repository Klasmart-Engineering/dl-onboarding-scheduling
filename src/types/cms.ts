export type ScheduleClassType =
  | `OnlineClass`
  | `OfflineClass`
  | `Homework`
  | `Task`;
export type AssessmentStatus = `complete` | `in_progress`;
export type ScheduleStatus = `NotStart` | `Started` | `Closed`;
export type RepeatEndType = `never` | `after_count` | `after_time`;
export type ScheduleRepeatType = `daily` | `weekly` | `monthly` | `yearly`;
export type ScheduleViewType =
  | `day`
  | `work_week`
  | `week`
  | `month`
  | `year`
  | `full_view`;
export type ScheduleLiveTokenType = `live` | `preview`;
export type TimeBoundary = `intersect` | `union`;

export enum ContentType {
  IMAGE = 31,
  VIDEO = 32,
  AUDIO = 33,
  DOC = 34,
  ASSETS = 3,
  PLAN = 2,
  MATERIAL = 1,
  FOLDER = 10,
}

export type PublicStatusType =
  | `published`
  | `draft`
  | `pending`
  | `rejected`
  | `archive`;
export type OrderBy =
  | `id`
  | `-id`
  | `content_name`
  | `-content_name`
  | `create_at`
  | `-create_at`
  | `update_at`
  | `-update_at`;
