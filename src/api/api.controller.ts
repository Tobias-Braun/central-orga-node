import { Controller, Get } from '@nestjs/common';
import { DayEvaluationService } from '../day-evaluation/day-evaluation.service';
import { TodoListService } from '../todo-list/todo-list.service';
import { BlockingStatusService } from '../blocking-status/blocking-status.service';
import { currentDateAsDateString, TodoList } from '../todo-list/todo-list.entity';
import { DayEvaluation } from '../day-evaluation/day-evaluation.entity';
import { BlockingStatus } from 'src/blocking-status/blocking-status.entity';

@Controller('api/v1')
export class ApiController {

    constructor(
        private readonly dayEvaluationService: DayEvaluationService,
        private readonly todoListService: TodoListService,
        private readonly blockingStatusService: BlockingStatusService,
    ) { }

    @Get('/eval-today')
    async getDayEvaluation(): Promise<DayEvaluation> {
        let dateString = currentDateAsDateString();
        let dayEval = await this.dayEvaluationService.getDayEvaluationForDateString(dateString);
        return dayEval
    }

    @Get('/planned-today')
    async getPlannedTodos(): Promise<TodoList> {
        let dateString = currentDateAsDateString();
        let todoList = await this.todoListService.getPlannedForDateString(dateString);
        return todoList;
    }

    @Get('/blocking-status')
    getBlockingStatus(): Promise<BlockingStatus> {
        return this.blockingStatusService.getBlockingStatus();
    }
}
