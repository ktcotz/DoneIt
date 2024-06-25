import { TodoList } from "./TodoList";
import { Todo } from "./TodoSchema";

export class TodoListServices {
  constructor(private todoList: TodoList) {}

  addTodo(data: Todo) {
    return this.todoList.addTodo(data);
  }
}
