import fs from 'fs';
import path from 'path';

import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

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
  verifyAddScheduleSuccess,
  verifyRowAddScheduleRequestMapper,
} from '../../utils/cms';
import { deleteDotfile } from '../../utils/cron';
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
          if (verifyRowAddScheduleRequestMapper(rowMapper)) {
            const result = await this.addSchedule(
              rowMapper.request as AddScheduleRequest
            );
            if (verifyAddScheduleSuccess(result)) {
              rowMapper.row.result = `true`;
            } else {
              throw new Error(result.label);
            }
          } else {
            throw rowMapper.request as Error;
          }
        } catch (error) {
          rowMapper.row.result = `false`;
          rowMapper.row.errors = [(error as Error).message];
          const axiosError = error as AxiosError;
          if (axiosError.isAxiosError && axiosError.response) {
            rowMapper.row.errors.push(axiosError.response.data.label);
          }
        }
        startIndex++;
        this.startAddSchedulesWithTimeout(startIndex, rowMappers, timeout);
      }, timeout);
    } else {
      const scheduleCsvFilePath = path.resolve(UPLOAD_DIR, `schedules.csv`);
      const resultFilePath = path.resolve(OUTPUT_DIR, `schedules.csv`);
      writeToCsv(
        resultFilePath,
        rowMappers.map((mapper, index) => ({
          row: index,
          title: mapper.row.title,
          result: mapper.row.result,
          errors: mapper.row.errors || [],
        }))
      );
      fs.unlinkSync(scheduleCsvFilePath);
    }
  }

  async addSchedules(dotfilePath?: string): Promise<boolean> {
    const scheduleCsvFilePath = path.resolve(UPLOAD_DIR, `schedules.csv`);
    const resultFilePath = path.resolve(OUTPUT_DIR, `schedules.csv`);
    let result = true;

    try {
      const rows = await parseCsv(scheduleCsvFilePath, resultFilePath, {
        cast: (value, context) => {
          if (context.column === 'repeat' && value !== '') {
            return parseWeeklyRepeat(value);
          }
          return value;
        },
      });

      if (rows === undefined) {
        deleteDotfile(dotfilePath);
        return false;
      }

      if (!rows.length) {
        fs.unlinkSync(scheduleCsvFilePath);
        writeToCsv(resultFilePath, [{ message: 'File is empty.' }]);
        result = false;
      }

      const rowMappers = await parseRowsToRowAddScheduleRequestMappers(rows);
      this.startAddSchedulesWithTimeout(0, rowMappers, ADD_SCHEDULE_INTERVAL);
    } catch (error) {
      fs.unlinkSync(path.resolve(UPLOAD_DIR, `schedules.csv`));
      writeToCsv(resultFilePath, [
        { message: `Add schedules failed with error ${error}!` },
      ]);
      result = false;
    }

    deleteDotfile(dotfilePath);
    return result;
  }
}
