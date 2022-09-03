import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VARIABLES } from '../env/env';
import { TodoList } from './todo-list';

@Injectable()
export class TodoListService {

    private todoistApi: TodoistApi;
    private readonly logger = new Logger(TodoListService.name);

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get(ENV_VARIABLES.todoist_token);
        this.todoistApi = new TodoistApi(token);
    }

    public async getCurrentDayTodoList() {
        this.logger.log("getting current days todo list")
        try {
            let tasks = await this.todoistApi.getTasks({ "filter": "today" }) as Task[];
            let todoList = this.mapTaskstoTodoList(tasks);
            console.log(todoList);
        } catch (error) {
            this.logger.error(error);
        }
    }

    private mapTaskstoTodoList(taskList: Task[]): TodoList {
        const todoListItems = taskList.map(task => ({
            id: task.id,
            name: task.content,
            projectId: task.projectId,
        }));
        const today = new Date();
        return ({ date: today, todoListItems: todoListItems });
    }
}
