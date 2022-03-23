import {
  AddScheduleRequest,
  ScheduleRepeat,
} from '../interfaces/cms/addSchedule';
import { AdminService } from '../services';
import { CMSService } from '../services/cms';
import { RepeatEndType, ScheduleClassType, ScheduleRepeatType } from '../types';

export const parseWeeklyRepeat = (repeatString: string): ScheduleRepeat => {
  const repeatParams = repeatString.split(`;`);

  return repeatParams.length === 6 && repeatParams[0] === `weekly`
    ? {
        // Only support for weekly currently.
        type: repeatParams[0] as ScheduleRepeatType,
        weekly: {
          interval: parseInt(repeatParams[1]),
          on: repeatParams[2] ? repeatParams[2].split(`+`) : [],
          end: {
            type: repeatParams[3] as RepeatEndType,
            after_count: parseInt(repeatParams[4]),
            after_time: Date.parse(repeatParams[5]) / 1000,
          },
        },
      }
    : {};
};

export type RowAddScheduleRequestMapper = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, any>;
  request: AddScheduleRequest | Error;
};
export const parseRowsToRowAddScheduleRequestMappers = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>[]
): Promise<RowAddScheduleRequestMapper[]> => {
  const adminService = await AdminService.getInstance();
  const cmsService = await CMSService.getInstance();

  const organizationNames = rows.map((row) => row.organization_name);
  const classNames = rows.map((row) => row.class_name);

  const organizations = await adminService.getOrganizations(organizationNames);
  const classes = await adminService.getClasses(classNames);

  const addScheduleRequests = await Promise.all(
    rows.map(async (row): Promise<RowAddScheduleRequestMapper> => {
      try {
        const organizationOfRow = organizations.find(
          (org) => org.name === row.organization_name
        );
        const classOfRow = classes.find(
          (classItem: { name: string }) => classItem.name === row.class_name
        );

        if (!organizationOfRow) throw new Error('Not found organization.');
        if (!classOfRow) throw new Error('Not found class.');

        const lessonPlan = await cmsService.getLessonPlanByName(
          organizationOfRow.id,
          row.lesson_plan_name
        );

        if (!lessonPlan.id) throw new Error('Not found lesson plan ID.');

        const lessonPlanDetail = await cmsService.getLessonPlanDetail({
          org_id: organizationOfRow.id,
          content_id: lessonPlan.id,
        });

        if (!lessonPlanDetail) throw new Error('Not found lesson plan defail.');

        return {
          row,
          request: {
            org_id: organizationOfRow.id,
            attachment_path: '',
            class_id: classOfRow.id,
            class_type: row.class_type as ScheduleClassType,
            description: row.description,
            due_at: row.due_at ? Date.parse(row.due_at) / 1000 : 0,
            is_all_day: row.is_all_day === 'true',
            is_force: row.is_force === 'true',
            is_repeat: row.is_repeat === 'true',
            lesson_plan_id: lessonPlan.id,
            program_id: lessonPlanDetail.program,
            repeat:
              row.is_repeat === 'true' && row.repeat
                ? (row.repeat as ScheduleRepeat)
                : {},
            subject_id:
              lessonPlanDetail.subject.length > 0
                ? lessonPlanDetail.subject[0]
                : '',
            teacher_ids: [...classOfRow.teacherIds, ...classOfRow.studentIds],
            title: row.title,
            outcome_ids: [],
            start_at: row.start_at
              ? Date.parse(`${row.date} ${row.start_at}`) / 1000
              : 0,
            end_at: row.end_at
              ? Date.parse(`${row.date} ${row.end_at}`) / 1000
              : 0,
            subject_ids: lessonPlanDetail.subject,
            attachment: {
              id: '',
              name: '',
            },
            time_zone_offset:
              parseInt(row.time_zone_offset.replace(/\D/g, '')) * 60 * 60,
            is_home_fun: row.is_home_fun === 'true',
            class_roster_student_ids: classOfRow.studentIds,
            class_roster_teacher_ids: classOfRow.teacherIds,
            participants_student_ids: [],
            participants_teacher_ids: [],
          },
        };
      } catch (error) {
        return { row, request: error as Error };
      }
    })
  );
  return addScheduleRequests;
};
