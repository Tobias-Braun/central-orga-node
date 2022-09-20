import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLES } from '../env/env';
import {
  emptyTodoList,
  TodoList,
  TodoListItem,
} from '../todo-list/todo-list.entity';

@Injectable()
export class TodoistService {
  private todoistApi: TodoistApi;
  private readonly logger = new Logger(TodoistService.name);

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get(ENV_VARIABLES.todoist_token);
    this.todoistApi = new TodoistApi(token);
  }

  public async getTodoListForDateString(dateString: string): Promise<TodoList> {
    this.logger.log('getting current days todo list');
    try {
      const tasks = (await this.todoistApi.getTasks({
        filter: dateString,
      })) as Task[];
      const todoList = mapTaskstoTodoList(tasks);
      return todoList;
    } catch (error) {
      this.logger.error(error);
      return emptyTodoList();
    }
  }

  public async getCompletedForTodoList(
    todoList: TodoList,
  ): Promise<TodoListItem[]> {
    const taskIds = todoList.todoListItems.map((item) => parseInt(item.id));
    this.logger.log(
      `getting updated info for todoList of ${todoList.dateString}`,
    );
    try {
      let tasks = await Promise.all(
        taskIds.map((taskId) => this.todoistApi.getTask(taskId)),
      );
      tasks = tasks.filter((task) => task.completed);
      const todoListItems = mapTaskListToTodoListItems(tasks);
      return todoListItems;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}

function mapTaskListToTodoListItems(taskList: Task[]): TodoListItem[] {
  return taskList.map((task) => ({
    id: String(task.id),
    name: task.content,
    projectId: String(task.projectId),
  }));
}

function mapTaskstoTodoList(taskList: Task[]): TodoList {
  const todoList = emptyTodoList();
  const todoListItems = mapTaskListToTodoListItems(taskList);
  todoList.todoListItems = todoListItems;
  return todoList;
}
