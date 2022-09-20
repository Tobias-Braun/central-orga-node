import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyTodoList, TodoList, TodoListItem } from './todo-list.entity';
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
  ) {}

  async loadPlannedTasksForDateString(dateString: string): Promise<TodoList> {
    this.logger.log('Trying to fetch current days todo list from todoist');
    try {
      const fromTodoist = await this.todoistService.getTodoListForDateString(
        dateString,
      );
      this.logger.log(
        `Tasks for ${
          fromTodoist.dateString
        } fetched from Todoist: [${fromTodoist.todoListItems
          .map((item) => item.name)
          .toString()}]`,
      );
      const existingEntry = await this.todoListRepository.findOneBy({
        dateString: fromTodoist.dateString,
      });
      if (existingEntry !== null) {
        // update entry
        await Promise.all(
          existingEntry.todoListItems.map((item) =>
            this.todoListItemRepository.update({ id: item.id }, item),
          ),
        );
        await this.todoListRepository.update(
          { dateString: fromTodoist.dateString },
          { dateString: existingEntry.dateString, id: existingEntry.id },
        );
      } else {
        // save entry
        await this.todoListRepository.save(fromTodoist);
      }
      return fromTodoist;
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve(emptyTodoList()); // returns empty list
    }
  }

  async getDifferenceForDateString(dateString: string): Promise<number> {
    const currentTodoList = await this.todoListRepository.findOneBy({
      dateString,
    });
    if (currentTodoList === null) {
      this.logger.error(
        'Cant get planned Tasks for today, treating difference as 0',
      );
      return Promise.resolve(0);
    }
    const completedItems = await this.todoistService.getCompletedForTodoList(
      currentTodoList,
    );
    return currentTodoList.todoListItems.length - completedItems.length;
  }

  async getPlannedForDateString(dateString: string): Promise<TodoList> {
    return await this.todoListRepository.findOneBy({ dateString });
  }
}
