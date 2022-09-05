import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TodoList {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column({ type: "date", unique: true })
    dateString: string;

    @OneToMany(() => TodoListItem, (todoListItem) => todoListItem.todoList, {
        cascade: true,
        eager: true,
    })
    todoListItems: TodoListItem[];
}

@Entity()
export class TodoListItem {

    @PrimaryColumn({ type: "bigint" })
    id: string;

    @Column()
    name: string;

    @Column({ type: "bigint" })
    projectId: string;

    @ManyToOne(() => TodoList, (todoList) => todoList.todoListItems)
    todoList?: TodoList;
}

export function emptyTodoList(): TodoList {
    return { dateString: currentDateAsDateString(), todoListItems: [] };
}

export function convertToDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function currentDateAsDateString(): string {
    return convertToDateString(new Date());
}