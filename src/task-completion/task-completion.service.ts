import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TodoListService } from '../todo-list/todo-list.service';
import { PiholeService } from '../pihole/pihole.service';
import { setTimeout } from 'timers/promises';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLES } from '../env/env';
import { DayEvaluationService } from '../day-evaluation/day-evaluation.service';
import { DayEvaluation } from '../day-evaluation/day-evaluation.entity';

@Injectable()
export class TaskCompletionService {

    private readonly logger = new Logger(TaskCompletionService.name);

    constructor(
        private readonly todoListService: TodoListService,
        private readonly piholeService: PiholeService,
        private readonly configService: ConfigService,
        private readonly dayEvaluationService: DayEvaluationService,
    ) { }

    @Cron('0 6 * * * ')
    savePlannedTodoListForToday() {
        this.logger.log("getting planned todo list for today");
        this.todoListService.findForToday();
    }

    @Cron('55 23 * * *')
    async checkDifferenceBetweenPlannedAndCompletedTasks() {
        this.logger.log("checking the difference between planned and completed tasks");
        let difference = await this.todoListService.getDifferenceForToday();
        this.logger.log(`difference: ${difference}`);
        if (difference > 0) {
            this.logger.log("not all tasks completed, initiating entertainment block");
            this.addPiholeBlock(difference);
        }
    }

    private getBlockTimeInMs(difference: number) {
        return Math.min(
            this.configService.get(ENV_VARIABLES.blockTimePerUncompletedTask) * difference,
            this.configService.get(ENV_VARIABLES.maxBlockTime)
        ) * 1000; // * 1000 because we convert seconds to milliseconds
    }

    async addPiholeBlock(difference: number) {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayString = yesterday.toISOString().slice(0, 10);
        try {
            let dayEvaluation = await this.dayEvaluationService.getDayEvaluationForDateString(yesterdayString);
            if (dayEvaluation.shouldActivateBlocking) {
                this.piholeService.activateBlockList();
                this.scheduleRemovePiholeBlock(dayEvaluation.blockTimeInMs);
            }


        } catch (error) {
            this.logger.error("cant get day evaluation for yesterday, quitting evaluation without block");
        }
    }

    async scheduleRemovePiholeBlock(timeout: number) {
        await setTimeout(timeout);
        this.logger.log("removing pihole block");
        this.piholeService.deactivateBlockList();
    }
}
