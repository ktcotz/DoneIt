import { Storage } from "../Storage/Storage";
import { UI } from "../UI/UI";
import { Todo } from "./Todo";
import { TodoSchemaType } from "./TodoSchema";

export enum TodoStatus {
  Active = "active",
  Complete = "complete",
}

export class TodoList extends UI {
  private parentElement =
    document.querySelector<HTMLDivElement>("[data-container]");
  private todos: TodoSchemaType[] = [];
  private storage = new Storage<TodoSchemaType[]>();
  private storage_key = "todos";

  constructor() {
    super();

    this.addEventListeners();

    this.getInitialTodos();
    this.renderTodos();
  }

  private addEventListeners() {
    this.parentElement?.addEventListener("click", ({ target }) => {
      if (!(target instanceof HTMLButtonElement)) return;

      if (target.classList.contains("btn--edit")) {
        const id = target.getAttribute("data-handle-item");

        this.editTodo(id);
      }
    });
  }

  private getInitialTodos() {
    const todos = this.storage.getFromStorage(this.storage_key);

    if (!todos) return;

    this.todos = todos;
  }

  private setEmptyTodosContainer() {
    if (!this.parentElement) return;

    const emptyContent = /* HTML */ `
      <div class="todo-list__item">
        <p class="todo-list__empty">No tasks found.</p>
      </div>
    `;

    this.parentElement.insertAdjacentHTML("afterbegin", emptyContent);
  }

  private renderTodos() {
    this.clearElement(this.parentElement);

    if (this.todos.length === 0) {
      return this.setEmptyTodosContainer();
    }

    this.todos.forEach((todo) => {
      this.parentElement?.insertAdjacentHTML(
        "afterbegin",
        new Todo(todo).renderContent()
      );
    });
  }

  addTodo(data: TodoSchemaType) {
    this.todos.push(data);
    this.storage.saveToStorage(this.storage_key, this.todos);
    this.renderTodos();
  }

  editTodo(id: string | null) {
    if (!id) return;

    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) return;

    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            status:
              todo.status === "active"
                ? TodoStatus.Complete
                : TodoStatus.Active,
          }
        : todo
    );

    this.storage.saveToStorage(this.storage_key, this.todos);
    this.renderTodos();
  }
}
