import updateGitHub from './updateGitHub';
import { CronJob } from 'cron';
import { logger } from '../util/logging';

/**
 * Defines a single task which should be executed on
 * a fixed schedule automatically.
 */
interface Task {
    name: string;
    schedule: string;
    invoke: () => Promise<void>;
}

/**
 * List of all the tasks which should be running.
 */
const tasks: Task[] = [
    {
        name: 'updateGitHub',
        schedule: '* */20 * * *',
        invoke: updateGitHub,
    },
];

/**
 * Begins to schedule all the defined tasks.
 */
export function start(): void {
    tasks.forEach((task) => {
        logger.debug(`Starting task initially: ${task.name}`);
        task.invoke();

        new CronJob(task.schedule, () => {
            logger.debug(`Starting task: ${task.name}`);
            task.invoke();
        }).start();
    });
}
