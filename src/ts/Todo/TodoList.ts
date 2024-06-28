import { Filter } from "../Filter/Filter";
import { Storage } from "../Storage/Storage";
import { Modal } from "../UI/Modal";
import { UI } from "../UI/UI";
import { Todo } from "./Todo";
import { TodoSchemaType } from "./TodoSchema";
import { selectOptions } from "./data";
import { isValidStatus } from "./helpers";

export enum TodoStatus {
  Active = "active",
  Complete = "complete",
}

export class TodoList extends UI {
  private parentElement = document.querySelector<HTMLDivElement>("[data-list]");
  private todosContainer =
    document.querySelector<HTMLDivElement>("[data-container]");
  private todosItemsCountElement = document.querySelector("[data-items-left]");
  private todos: TodoSchemaType[] = [];
  private storage = new Storage<TodoSchemaType[]>();
  private storage_key = "todos";
  private modal = new Modal();
  private filter = new Filter();

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

        this.editTodoStatus(id);
      }

      if (target.classList.contains("btn--global-edit")) {
        const id = target.getAttribute("data-handle-item");

        this.editTodo(id);
      }

      if (target.classList.contains("btn--global-delete")) {
        const id = target.getAttribute("data-handle-item");

        this.deleteTodo(id);
      }

      if (target.classList.contains("btn--clear-all")) {
        this.clearAllCompletedTodos();
      }
    });
  }

  private getInitialTodos() {
    const todos = this.storage.getFromStorage(this.storage_key);

    if (!todos) return;

    this.todos = todos;
  }

  private setEmptyTodosContainer() {
    if (!this.todosContainer) return;

    const emptyContent = /* HTML */ `
      <div class="todo-list__item">
        <p class="todo-list__empty">No tasks found.</p>
      </div>
    `;

    this.todosContainer.insertAdjacentHTML("afterbegin", emptyContent);
  }

  private renderTodos() {
    this.clearElement(this.todosContainer);

    console.log(this.filter.global_filter);

    const filteredTodos =
      this.filter.global_filter === "all"
        ? this.todos
        : this.todos.filter(
            (todo) => todo.status === this.filter.global_filter
          );

    console.log(filteredTodos);

    if (filteredTodos.length === 0) {
      return this.setEmptyTodosContainer();
    }

    this.setTodosCount(filteredTodos);

    filteredTodos.forEach((todo) => {
      this.todosContainer?.insertAdjacentHTML(
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

  editTodoStatus(id: string | null) {
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

  private setTodosCount(todos: TodoSchemaType[]) {
    if (!this.todosItemsCountElement) return;

    this.todosItemsCountElement.textContent = `${todos.length}`;
  }

  private clearAllCompletedTodos() {
    this.todos = this.todos.filter(
      (todo) => todo.status !== TodoStatus.Complete
    );

    this.filter.setFilterToURL("all");
    this.storage.saveToStorage(this.storage_key, this.todos);
    this.renderTodos();
  }

  private handleEditModal(id: string) {
    const titleElement = document.querySelector<HTMLInputElement>(
      "[data-modal-todo-title]"
    );
    const statusElement = document.querySelector<HTMLSelectElement>(
      "[data-modal-todo-status]"
    );

    if (!titleElement || !statusElement) return;
    if (!titleElement.value) return;
    if (!isValidStatus(statusElement.value)) return;

    const todo = this.getTodoByID(id);

    if (!todo) return;

    todo.title = titleElement.value;
    todo.status = statusElement.value;

    this.storage.saveToStorage(this.storage_key, this.todos);
    this.modal.closeModal();
    this.renderTodos();
  }

  private handleDeleteModal(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.storage.saveToStorage(this.storage_key, this.todos);
    this.modal.closeModal();
    this.renderTodos();
  }

  editTodo(id: string | null) {
    if (!id) return;

    const todo = this.getTodoByID(id);

    if (!todo) return;

    this.modal.openModal({
      title: `Edit todo : ${id}`,
      content: this.generateEditTodoModalContent(todo),
      confirmFunction: () => this.handleEditModal(id),
    });
  }

  deleteTodo(id: string | null) {
    if (!id) return;

    const todo = this.getTodoByID(id);

    if (!todo) return;

    this.modal.openModal({
      title: `Delete todo : ${id}`,
      content: this.generateDeleteTodoModalContent(),
      confirmFunction: () => this.handleDeleteModal(id),
    });
  }

  private getTodoByID(id: string) {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) return;

    return todo;
  }

  private generateEditTodoModalContent(todo: TodoSchemaType) {
    const editTodoModalContent = /* HTML */ `
      <div class="modal__edit">
        <div class="form__input-container">
          <input
            type="text"
            class="form__input modal__input"
            id="modal-todo"
            data-modal-todo-title
            required
            maxlength="50"
            value="${todo.title}"
          />
          <label for="modal-todo" class="form__label">Edit todo name...</label>
        </div>
        <div class="form__edit-modal">
          <select
            name="status"
            id="status"
            class="form__select"
            value=${todo.status}
            data-modal-todo-status
            aria-label="Change todo status"
          >
            ${selectOptions.map(
              (option) =>
                `<option value=${option.value} ${
                  option.value === todo.status ? "selected" : ""
                }>${option.title}</option>`
            )}
          </select>
          <label for="status" class="visually-hidden"
            >Edit todo status...</label
          >
        </div>
      </div>
    `;

    return editTodoModalContent;
  }

  private generateDeleteTodoModalContent() {
    const deleteTodoModalContent = /* HTML */ `
      <p>Are you sure you want to delete this task?</p>
      <p><strong>Action is irreversible!</strong></p>
    `;

    return deleteTodoModalContent;
  }
}
