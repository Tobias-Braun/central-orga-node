import { Controller, Get, Logger, Query } from '@nestjs/common';
import { DayEvaluationService } from '../day-evaluation/day-evaluation.service';
import { TodoListService } from '../todo-list/todo-list.service';
import { BlockingStatusService } from '../blocking-status/blocking-status.service';
import { currentDateAsDateString, TodoList, validateDateString } from '../todo-list/todo-list.entity';
import { DayEvaluation } from '../day-evaluation/day-evaluation.entity';
import { BlockingStatus } from 'src/blocking-status/blocking-status.entity';

export interface DateStringQuery {
    dateString: string;
}

@Controller('api/v1')
export class ApiController {

    private readonly logger = new Logger(ApiController.name);

    constructor(
        private readonly dayEvaluationService: DayEvaluationService,
        private readonly todoListService: TodoListService,
        private readonly blockingStatusService: BlockingStatusService,
    ) { }

    @Get('/eval-today')
    async getDayEvaluation(@Query() query: DateStringQuery): Promise<DayEvaluation> {
        let isValid = validateDateString(query.dateString);
        if (!isValid) {
            this.logger.warn("Invalid dateString used as input: " + query.dateString);
            return null;
        }
        try {
            let dayEval = await this.dayEvaluationService.getDayEvaluationForDateString(query.dateString);
            return dayEval;
        } catch (error) {
            this.logger.error(error);
        }
        return undefined;
    }

    @Get('/planned-today')
    async getPlannedTodos(@Query() query: DateStringQuery): Promise<TodoList> {
        let isValid = validateDateString(query.dateString);
        if (!isValid) {
            this.logger.warn("Invalid dateString used as input: " + query.dateString);
            return null;
        }
        try {
            let todoList = await this.todoListService.getPlannedForDateString(query.dateString);
            return todoList;
        } catch (error) {
            this.logger.error(error)
        }
        return undefined;
    }

    @Get('/blocking-status')
    getBlockingStatus(): Promise<BlockingStatus> {
        return this.blockingStatusService.getBlockingStatus();
    }
}
