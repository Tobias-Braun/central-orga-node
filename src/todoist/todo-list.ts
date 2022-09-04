export class TodoList {
    date: Date;
    todoListItems: TodoListItem[];
}

export interface TodoListItem {
    id: number;
    name: string;
    projectId: number;
}

export function emptyTodoList(): TodoList {
    return { date: new Date(), todoListItems: [] };
}