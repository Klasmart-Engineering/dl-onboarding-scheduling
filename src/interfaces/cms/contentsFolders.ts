import { ContentType, OrderBy, PublicStatusType } from '../../types';

import { BaseRequest } from './base';

export interface ContentsFoldersRequest extends BaseRequest {
  name?: string; // Used to search with keyword
  author?: string;
  content_type?: string; // ex: 1,2,10
  scope?: string;
  content_name?: string; // Used to search the exact name
  submenu?: string;
  program?: string;
  program_group?: string;
  path?: string;
  source_type?: string;
  publish_status?: PublicStatusType;
  order_by?: OrderBy;
  page_size?: number;
  page?: number;
}

export interface ContentsLessonPlansRequest extends BaseRequest {
  lesson_plan_name: string;
  group_names: string[];
  age_ids?: string[];
  authed_org_ids?: AuthedOrgIds;
  author?: string;
  category_ids?: ContentIds;
  content_name?: string;
  content_type?: number[];
  data_source_id?: string;
  dir_path?: string;
  grade_ids?: string[];
  join_user_id_list?: string[];
  name?: number;
  order_by?: OrderBy;
  org?: string;
  pager?: Pager;
  parent_id?: string;
  parent_path?: ParentPath;
  program?: string[];
  program_ids?: string[];
  publish_status?: string[];
  published_query_mode?: string;
  source_type?: string;
  sub_category_ids?: string[];
  subject_ids?: string[];
  visibility_settings?: string[];
}

export interface ContentPermission {
  allow_approve?: boolean;
  allow_delete?: boolean;
  allow_edit?: boolean;
  allow_reject?: boolean;
  allow_republish?: boolean;
  id?: string;
}

export interface ContentFolderData {
  author?: string;
  author_name?: string;
  content_type?: ContentType;
  content_type_name?: string;
  create_at?: number;
  data?: string;
  description?: string;
  dir_path?: string;
  id?: string;
  items_count?: number;
  keywords?: string[];
  name?: string;
  permission?: ContentPermission;
  publish_status?: PermissionStatus;
  thumbnail?: string;
  update_at?: number;
}

export interface ContentsLessonPlansData {
  group_name: string;
  id: string;
  name: string;
}

export interface ContentsFoldersResponse {
  list?: ContentFolderData[];
  total?: number;
}

export interface ContentsLessonPlansResponse {
  data?: ContentsLessonPlansData[];
  total?: number;
}

export interface AuthedOrgIds {
  strings: string[];
  valid: boolean;
}

export interface ContentIds {
  strings: string[];
  valid: boolean;
}

export interface Pager {
  pageIndex: number;
  pageSize: number;
}

export interface ParentPath {
  strings: string[];
  valid: boolean;
}
