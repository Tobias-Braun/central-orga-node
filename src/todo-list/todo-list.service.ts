import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList, emptyTodoList, currentDateAsDateString, TodoListItem } from './todo-list.entity';
import { TodoistService } from '../todoist/todoist.service';

@Injectable()
export class TodoListService {

    private readonly logger = new Logger(TodoListService.name);

    constructor(
        @InjectRepository(TodoList)
        private readonly todoListRepository: Repository<TodoList>,
        @InjectRepository(TodoListItem)
        private readonly todoListItemRepository: Repository<TodoListItem>,
        private readonly todoistService: TodoistService,
    ) { }

    findAll(): Promise<TodoList[]> {
        return this.todoListRepository.find();
    }

    async loadPlannedTasksForDateString(dateString: string): Promise<TodoList> {
        this.logger.log("Trying to fetch current days todo list from todoist")
        try {
            let fromTodoist = await this.todoistService.getTodoListForDateString(dateString);
            this.logger.log("fetched from todoist: " + JSON.stringify(fromTodoist));
            let existingEntry = await this.todoListRepository.findOneBy({ dateString: fromTodoist.dateString });
            if (existingEntry !== null) {
                // update entry
                await Promise.all(existingEntry.todoListItems.map(item => this.todoListItemRepository.update({ id: item.id }, item)));
                this.todoListRepository.update({ dateString: fromTodoist.dateString }, { dateString: existingEntry.dateString, id: existingEntry.id });
            } else {
                // save entry
                this.todoListRepository.save(fromTodoist);
            }
            return fromTodoist;
        } catch (error) {
            this.logger.error(error)
            return Promise.resolve(emptyTodoList()) // returns empty todo list
        }
    }

    async getDifferenceForDateString(dateString: string): Promise<number> {
        let currentTodoList = await this.todoListRepository.findOneBy({ dateString });
        if (currentTodoList === null) {
            this.logger.error("Cant get planned Tasks for today, treating difference as 0");
            return Promise.resolve(0);
        }
        let completedItems = await this.todoistService.getCompletedForTodoList(currentTodoList);
        return currentTodoList.todoListItems.length - completedItems.length;
    }

}
