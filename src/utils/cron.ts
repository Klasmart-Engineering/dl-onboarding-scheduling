import fs from 'fs';
import path from 'path';

import { OUTPUT_DIR, UPLOAD_DIR } from '../config';
import { CMSService } from '../services/cms';
import { processCsv } from '../utils/csv';

export const checkAndProcessCsvFiles = async () => {
  fs.readdir(UPLOAD_DIR, { withFileTypes: true }, (err, files) => {
    if (err) {
      /* eslint-disable-next-line no-console */
      console.log(`cron.onboard readdir get error ${err}`);
      return;
    }

    files.forEach(async (dirent) => {
      if (dirent.isFile() && dirent.name.includes('csv')) {
        let dotfile = '';
        switch (dirent.name) {
          case 'schools.csv':
            dotfile = '.schools';
            break;
          case 'classes.csv':
            dotfile = '.classes';
            break;
          case 'users.csv':
            dotfile = '.users';
            break;
          case 'schedules.csv':
            dotfile = '.schedules';
            break;

          default:
            // Does nothing
            return;
        }

        if (dotfile) {
          const dotfilePath = path.resolve(UPLOAD_DIR, dotfile);
          if (fs.existsSync(dotfilePath)) {
            /* eslint-disable-next-line no-console */
            console.log(`In progress onboarding ${dirent.name}!`);
            return;
          }

          fs.closeSync(fs.openSync(dotfilePath, 'w')); // create file for preventing multiple onboarding with the same file
          /* eslint-disable-next-line no-console */
          console.log(`Start onboarding ${dirent.name}!`);
          if (dirent.name.includes('schedules.csv')) {
            const cmsService = await CMSService.getInstance();
            await cmsService.addSchedules(dotfilePath);
          } else {
            await processCsv(
              path.resolve(UPLOAD_DIR, dirent.name),
              path.resolve(OUTPUT_DIR, dirent.name),
              dotfilePath
            );
          }
        }
      }
    });
  });
};

// delete dotfile so that we can onboard when there are new files
export const deleteDotfile = (dotfilePath?: string) => {
  if (dotfilePath) {
    fs.unlinkSync(dotfilePath);
  }
};
