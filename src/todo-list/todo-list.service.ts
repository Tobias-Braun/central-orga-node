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

    async findForToday(): Promise<TodoList> {
        let dateString = currentDateAsDateString();
        let todoList = await this.todoListRepository.findOneBy({ dateString: dateString });
        if (todoList !== null) {
            return todoList;
        }
        this.logger.log("Trying to fetch current days todo list from todoist")
        try {
            let fromTodoist = await this.todoistService.getCurrentDayTodoList();
            this.todoListRepository.save(fromTodoist);
            return fromTodoist;
        } catch (error) {
            this.logger.error(error)
            return Promise.resolve(emptyTodoList()) // returns empty todo list
        }
    }

    async getDifferenceForToday(): Promise<number> {
        let currentTodoList = await this.findForToday();
        let completedItems = await this.todoistService.getCompletedForTodoList(currentTodoList);
        return currentTodoList.todoListItems.length - completedItems.length;
    }

}
