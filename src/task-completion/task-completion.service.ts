import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TodoListService } from '../todo-list/todo-list.service';
import { PiholeService } from '../pihole/pihole.service';
import { setTimeout } from 'timers/promises';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLES } from '../env/env';

@Injectable()
export class TaskCompletionService {

    private readonly logger = new Logger(TaskCompletionService.name);

    constructor(private readonly todoListService: TodoListService, private readonly piholeService: PiholeService, private readonly configService: ConfigService) { }

    @Cron('0 * * * * * ')
    savePlannedTodoListForToday() {
        this.logger.log("getting planned todo list for today");
        this.todoListService.findForToday();
    }

    @Cron('40 * * * * *')
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
        await this.piholeService.activateBlockList();
        const blockTime = this.getBlockTimeInMs(difference);
        console.log("blockTime", blockTime);
        this.scheduleRemovePiholeBlock(blockTime);
    }

    async scheduleRemovePiholeBlock(timeout: number) {
        console.log("in scheduleRemovePiholeBlock");
        await setTimeout(timeout);
        console.log("removing pihole block");
        this.logger.log("removing pihole block");
        this.piholeService.deactivateBlockList();
    }
}
