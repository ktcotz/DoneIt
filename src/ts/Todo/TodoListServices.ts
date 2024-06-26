import { TodoList } from "./TodoList";
import { TodoSchemaType } from "./TodoSchema";

export class TodoListServices {
  constructor(private todoList: TodoList) {}

  addTodo(data: TodoSchemaType) {
    return this.todoList.addTodo(data);
  }
}
