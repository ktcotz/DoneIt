import { Todo } from "./TodoSchema";

export enum TodoStatus {
  Active = "active",
  Complete = "complete",
}

export class TodoList {
  private todos: Todo[] = [];

  addTodo(data: Todo) {
    this.todos.push(data);

    console.log(this.todos);
  }
}
