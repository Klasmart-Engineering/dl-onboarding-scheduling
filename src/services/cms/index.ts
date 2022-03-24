import fs from 'fs';
import path from 'path';

import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { ADD_SCHEDULE_INTERVAL, OUTPUT_DIR, UPLOAD_DIR } from '../../config';
import {
  AddScheduleRequest,
  AddScheduleResponse,
} from '../../interfaces/cms/addSchedule';
import {
  ContentFolderData,
  ContentsFoldersRequest,
  ContentsFoldersResponse,
} from '../../interfaces/cms/contentsFolders';
import {
  GetContentRequest,
  GetContentResponse,
} from '../../interfaces/cms/getContent';
import {
  PostSchedulesTimeViewListRequest,
  PostSchedulesTimeViewListResponse,
} from '../../interfaces/cms/schedulesTimeView';
import { Uuid } from '../../utils';
import {
  parseRowsToRowAddScheduleRequestMappers,
  parseWeeklyRepeat,
  RowAddScheduleRequestMapper,
} from '../../utils/cms';
import { parseCsv, writeToCsv } from '../../utils/csv';
import { AuthService } from '../auth';
import { BaseRestfulService } from '../baseRestfulService';
export class CMSService extends BaseRestfulService {
  private static _instance: CMSService;
  private constructor(private _client: AxiosInstance) {
    super();
  }

  public static async getInstance() {
    if (this._instance) return this._instance;

    this._instance = new CMSService(
      await AuthService.createClientWithAuthCookie(
        process.env.CMS_SERVICE_URL || ``
      )
    );
    return this._instance;
  }

  async getSchedulesTimeViewList(
    request: PostSchedulesTimeViewListRequest,
    config?: AxiosRequestConfig
  ): Promise<PostSchedulesTimeViewListResponse> {
    const { org_id, ...rest } = request;
    const result = await this._client.post<PostSchedulesTimeViewListResponse>(
      `/schedules_time_view/list`,
      rest,
      {
        ...config,
        params: {
          org_id,
          ...config?.params,
        },
      }
    );
    return result.data;
  }

  async getLessonPlans(
    request: ContentsFoldersRequest,
    config?: AxiosRequestConfig
  ): Promise<ContentsFoldersResponse> {
    const result = await this._client.get<PostSchedulesTimeViewListResponse>(
      `/contents_folders`,
      {
        ...config,
        params: {
          ...request,
          ...config?.params,
        },
      }
    );
    return result.data;
  }

  async getLessonPlanByName(
    orgID: Uuid,
    lessonName: string
  ): Promise<ContentFolderData> {
    const result = await this.getLessonPlans({
      org_id: orgID,
      content_name: lessonName,
      publish_status: 'published',
    });
    const lessonPlans = result.list || [];
    if (lessonPlans.length > 1)
      throw new Error(
        `Unexpectedly found more than one lesson plan with the name ${lessonName}, unable to identify which one should be used`
      );
    if (lessonPlans.length === 0)
      throw new Error(`Lesson plan ${lessonName} not found`);
    return lessonPlans[0];
  }

  async getLessonPlansByNames(
    orgID: Uuid,
    lessonNames: string[]
  ): Promise<ContentFolderData[]> {
    const result = await this.getLessonPlans({
      org_id: orgID,
      name: lessonNames.join(','),
      publish_status: 'published',
    });
    return result.list || [];
  }

  async getLessonPlanDetail(
    request: GetContentRequest,
    config?: AxiosRequestConfig
  ): Promise<GetContentResponse> {
    const result = await this._client.get<GetContentResponse>(
      `/contents/${request.content_id}`,
      {
        ...config,
        params: {
          org_id: request.org_id,
          ...config?.params,
        },
      }
    );
    return result.data;
  }

  async addSchedule(
    request: AddScheduleRequest,
    config?: AxiosRequestConfig
  ): Promise<AddScheduleResponse> {
    const { org_id, ...rest } = request;
    const result = await this._client.post<AddScheduleResponse>(
      `/schedules`,
      rest,
      {
        ...config,
        params: {
          org_id,
          ...config?.params,
        },
      }
    );
    return result.data;
  }

  startAddSchedulesWithTimeout(
    startIndex: number,
    rowMappers: RowAddScheduleRequestMapper[],
    timeout: number
  ) {
    if (startIndex < rowMappers.length) {
      const rowMapper = rowMappers[startIndex];
      setTimeout(async () => {
        try {
          // Verify rowMapper.request is AddScheduleRequest, not Error
          if ((rowMapper.request as AddScheduleRequest).org_id) {
            const result = await this.addSchedule(
              rowMapper.request as AddScheduleRequest
            );
            if (result.data && (result.data as unknown as { id: Uuid }).id) {
              rowMapper.row.result = `success`;
            } else {
              rowMapper.row.result = result.label;
            }
          } else {
            throw rowMapper.request as Error;
          }
        } catch (error) {
          rowMapper.row.result = (error as Error).message;
        }
        startIndex++;
        this.startAddSchedulesWithTimeout(startIndex, rowMappers, timeout);
      }, timeout);
    } else {
      const scheduleCsvFilePath = path.resolve(UPLOAD_DIR, `schedules.csv`);
      const resultFilePath = path.resolve(OUTPUT_DIR, `schedules.csv`);
      writeToCsv(
        resultFilePath,
        rowMappers.map((mapper) => mapper.row)
      );
      fs.unlinkSync(scheduleCsvFilePath);
    }
  }

  async addSchedules(): Promise<boolean> {
    const scheduleCsvFilePath = path.resolve(UPLOAD_DIR, `schedules.csv`);
    const resultFilePath = path.resolve(OUTPUT_DIR, `schedules.csv`);

    const rows = await parseCsv(scheduleCsvFilePath, resultFilePath, {
      cast: (value, context) => {
        if (context.column === 'repeat' && value !== '') {
          return parseWeeklyRepeat(value);
        }
        return value;
      },
    });

    if (rows === undefined) return false;

    if (!rows.length) {
      fs.unlinkSync(scheduleCsvFilePath);
      writeToCsv(resultFilePath, [{ message: 'File is empty.' }]);
      return false;
    }

    const rowMappers = await parseRowsToRowAddScheduleRequestMappers(rows);
    this.startAddSchedulesWithTimeout(0, rowMappers, ADD_SCHEDULE_INTERVAL);

    return true;
  }
}
