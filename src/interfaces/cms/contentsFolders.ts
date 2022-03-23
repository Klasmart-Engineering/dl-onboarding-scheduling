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

export interface ContentsFoldersResponse {
  list?: ContentFolderData[];
  total?: number;
}
