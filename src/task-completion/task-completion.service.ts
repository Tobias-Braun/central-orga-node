import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TodoListService } from '../todo-list/todo-list.service';

@Injectable()
export class TaskCompletionService {

    private readonly logger = new Logger(TaskCompletionService.name);

    constructor(private readonly todoListService: TodoListService) { }

    @Cron('*/20 * * * * * ')
    savePlannedTodoListForToday() {
        this.logger.log("getting planned todo list for today");
        this.todoListService.findForToday();
    }

    @Cron('5/20 * * * * *')
    async checkDifferenceBetweenPlannedAndCompletedTasks() {
        this.logger.log("checking the difference between planned and completed tasks");
        let difference = await this.todoListService.getDifferenceForToday();
        this.logger.log(`difference: ${difference}`);
    }
}
