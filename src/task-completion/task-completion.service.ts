import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TodoListService } from '../todo-list/todo-list.service';
import { PiholeService } from '../pihole/pihole.service';
import { setTimeout } from 'timers/promises';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLES } from '../env/env';
import { DayEvaluationService } from '../day-evaluation/day-evaluation.service';
import { BlockingStatusService } from '../blocking-status/blocking-status.service';
import { BlockingStatus } from '../blocking-status/blocking-status.entity';
import { currentDateAsDateString } from '../todo-list/todo-list.entity';
import { DayEvaluation } from '../day-evaluation/day-evaluation.entity';

@Injectable()
export class TaskCompletionService {

    private readonly logger = new Logger(TaskCompletionService.name);

    constructor(
        private readonly todoListService: TodoListService,
        private readonly piholeService: PiholeService,
        private readonly configService: ConfigService,
        private readonly dayEvaluationService: DayEvaluationService,
        private readonly blockingStatusService: BlockingStatusService,
    ) { }

    @Cron('0 6 * * * ')
    runPlannedTasksCheck() {
        this.logger.log("getting planned todo list for today");
        let todayString = currentDateAsDateString();
        this.todoListService.loadPlannedTasksForDateString(todayString);
    }

    @Cron('55 23 * * *')
    async runDifferenceCheck() {
        this.logger.log("checking the difference between planned and completed tasks");
        let dateString = currentDateAsDateString();
        try {
            let difference = await this.todoListService.getDifferenceForDateString(dateString);
            let numberOfUncompletedTasks = Math.max(difference, 0);
            let shouldActivateBlocking = numberOfUncompletedTasks > 0;
            let blockTimeInMs = this.getBlockTimeInMs(numberOfUncompletedTasks);
            let dayEvaluation: DayEvaluation = { dateString, numberOfUncompletedTasks, shouldActivateBlocking, blockTimeInMs };
            this.dayEvaluationService.addDayEvaluation(dayEvaluation);
        } catch (error) {
            this.logger.error("error running difference check: " + String(error));
        }

    }

    @Cron('0 8 * * *')
    async runAddBlockCheck() {
        this.logger.log("Checking if sites should be blocked for today");
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayString = yesterday.toISOString().slice(0, 10);
        try {
            let dayEvaluation = await this.dayEvaluationService.getDayEvaluationForDateString(yesterdayString);
            if (dayEvaluation.shouldActivateBlocking) {
                this.logger.log("not all tasks completed, initiating entertainment block");
                await this.piholeService.activateBlockList();
                this.blockingStatusService.updateBlockingStatus(BlockingStatus.ON);
                this.scheduleRemovePiholeBlock(dayEvaluation.blockTimeInMs);
            } else {
                this.logger.log("All tasks completed, no blocking necessary");
            }
        } catch (error) {
            this.logger.error("cant get day evaluation for yesterday, quitting evaluation without block, error: " + error);
        }
    }

    @Cron('0 2 * * *')
    async runRemoveBlockCheck() {
        try {
            let blockingStatus = await this.blockingStatusService.getBlockingStatus();
            if (blockingStatus.blockIsActive) {
                await this.scheduleRemovePiholeBlock(0);

            }
        } catch (error) {
            this.logger.error("Can't check current blocking status", error);
        }
    }

    private getBlockTimeInMs(numberOfUncompletedTasks: number) {
        return Math.min(
            this.configService.get(ENV_VARIABLES.blockTimePerUncompletedTask) * numberOfUncompletedTasks,
            this.configService.get(ENV_VARIABLES.maxBlockTime)
        ) * 1000; // * 1000 because we convert seconds to milliseconds
    }


    async scheduleRemovePiholeBlock(timeout: number) {
        await setTimeout(timeout);
        this.logger.log("removing pihole block");
        try {
            await this.piholeService.deactivateBlockList();
            this.blockingStatusService.updateBlockingStatus(BlockingStatus.OFF);
        } catch (error) {
            this.logger.error("failed async call to service:", error);
        }

    }
}
