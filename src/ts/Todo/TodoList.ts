import { Filter } from "../Filter/Filter";
import { Storage } from "../Storage/Storage";
import { Modal } from "../UI/Modal";
import { UI } from "../UI/UI";
import { Todo } from "./Todo";
import { TodoDOMHelper } from "./TodoDOMHelper";
import { TodoDataSchema, TodoSchemaType, TodoStatus } from "./TodoSchema";
import Sortable from "sortablejs";

export class TodoList extends UI {
  private parentElement = document.querySelector<HTMLDivElement>("[data-list]");

  private todoListElements = {
    container: document.querySelector<HTMLDivElement>("[data-container]"),
    count: document.querySelector("[data-items-left]"),
  };

  private config = {
    DATA_ATTRIBUTION_TODO_ITEM: "data-item",
    DATA_ATTRIBUTION_CHANGE_TODO_STATUS: "data-edit-button",
    DATA_ATTRIBUTION_EDIT_TODO: "data-global-edit",
    DATA_ATTRIBUTION_DELETE_TODO: "data-global-delete",
    DATA_ATTRIBUTION_DELETE_ALL_COMPLETED_TODO: "data-clear-all",
    DATA_ATTRIBUTION_BUTTON_DESCRIBED_TODO: "data-handle-item",
    SORTABLE_ANIMATION_TIME: 150,
    storage_key: "todos",
  };

  private todos: TodoSchemaType[] = [];

  private todo_dom_helper = new TodoDOMHelper();
  private storage = new Storage<TodoSchemaType[]>();
  private modal = new Modal();
  private filter = new Filter();

  constructor() {
    super();

    this.addEventListeners();
    this.initSortable();

    this.getInitialTodos();
    this.renderTodos();
  }

  private initSortable() {
    if (!this.todoListElements.container) return;

    Sortable.create(this.todoListElements.container, {
      animation: this.config.SORTABLE_ANIMATION_TIME,
      touchStartThreshold: 6,

      onEnd: () => {
        this.reorderSortableTodosInStorage();
      },
    });
  }

  private mutateTodosAndRender(todos: TodoSchemaType[]) {
    this.todos = todos;
    this.storage.saveToStorage(this.config.storage_key, this.todos);
    this.renderTodos();
  }

  private addEventListeners() {
    this.parentElement?.addEventListener("click", ({ target }) => {
      if (!(target instanceof HTMLButtonElement)) return;
      const id = target.getAttribute(
        this.config.DATA_ATTRIBUTION_BUTTON_DESCRIBED_TODO
      );

      if (
        target.hasAttribute(this.config.DATA_ATTRIBUTION_CHANGE_TODO_STATUS)
      ) {
        this.editTodoStatus(id);
      }

      if (target.hasAttribute(this.config.DATA_ATTRIBUTION_EDIT_TODO)) {
        this.editTodo(id);
      }

      if (target.hasAttribute(this.config.DATA_ATTRIBUTION_DELETE_TODO)) {
        this.deleteTodo(id);
      }

      if (
        target.hasAttribute(
          this.config.DATA_ATTRIBUTION_DELETE_ALL_COMPLETED_TODO
        )
      ) {
        this.clearAllCompletedTodos();
      }
    });

    window.addEventListener("popstate", () => {
      this.renderTodos();
    });
  }

  private getInitialTodos() {
    const todos = this.storage.getFromStorage(this.config.storage_key);

    if (!todos) return;

    this.todos = todos;
  }

  private renderTodos() {
    this.clearElement(this.todoListElements.container);

    const filteredTodos =
      this.filter.global_filter === "all"
        ? this.todos
        : this.todos.filter(
            (todo) => todo.status === this.filter.global_filter
          );

    this.setTodosCount(filteredTodos);
    
    if (filteredTodos.length === 0) {
      return this.todo_dom_helper.setEmptyTodosContainer(
        this.todoListElements.container
      );
    }

    filteredTodos.forEach((todo) => {
      this.todoListElements.container?.insertAdjacentHTML(
        "beforeend",
        new Todo(todo).renderContent()
      );
    });
  }

  addTodo(data: TodoSchemaType) {
    this.todos.push(data);
    this.mutateTodosAndRender(this.todos);
  }

  editTodoStatus(id: string | null) {
    if (!id) return;

    const editedTodos = this.todos.map((todo) =>
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

    this.mutateTodosAndRender(editedTodos);
  }

  private setTodosCount(todos: TodoSchemaType[]) {
    if (!this.todoListElements.count) return;

    this.todoListElements.count.textContent = `${todos.length}`;
  }

  private clearAllCompletedTodos() {
    const uncompleteTodos = this.todos.filter(
      (todo) => todo.status !== TodoStatus.Complete
    );

    this.filter.setFilterToURL("all");
    this.mutateTodosAndRender(uncompleteTodos);
  }

  private handleEditModal(id: string) {
    const titleElement = document.querySelector<HTMLInputElement>(
      "[data-modal-todo-title]"
    );
    const statusElement = document.querySelector<HTMLSelectElement>(
      "[data-modal-todo-status]"
    );

    if (!titleElement || !statusElement) return;

    const validTodoData = TodoDataSchema.parse({
      title: titleElement.value,
      status: statusElement.value,
    });

    const editedTodos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, ...validTodoData } : todo
    );

    this.modal.closeModal();
    this.mutateTodosAndRender(editedTodos);
  }

  private handleDeleteModal(id: string) {
    const newTodos = this.todos.filter((todo) => todo.id !== id);

    this.modal.closeModal();
    this.mutateTodosAndRender(newTodos);
  }

  editTodo(id: string | null) {
    if (!id) return;

    const todo = this.getTodoByID(id);

    if (!todo) return;

    this.modal.openModal({
      title: `Edit todo : ${id}`,
      content: this.todo_dom_helper.generateEditTodoModalContent(todo),
      confirmFunction: () => this.handleEditModal(id),
    });
  }

  deleteTodo(id: string | null) {
    if (!id) return;

    this.modal.openModal({
      title: `Delete todo : ${id}`,
      content: this.todo_dom_helper.generateDeleteTodoModalContent(),
      confirmFunction: () => this.handleDeleteModal(id),
    });
  }

  private getTodoByID(id: string) {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) return;

    return todo;
  }

  private reorderSortableTodosInStorage() {
    if (!this.todoListElements.container) return;

    const todoItems = [
      ...this.todoListElements.container.querySelectorAll<HTMLDivElement>(
        `[${this.config.DATA_ATTRIBUTION_TODO_ITEM}]`
      ),
    ];

    const todoIds = todoItems.map((todo) => {
      const id = todo.getAttribute(
        this.config.DATA_ATTRIBUTION_TODO_ITEM
      ) as NonNullable<string>;
      return id;
    });

    const todos = todoIds.map((todoID) => {
      const todo = this.getTodoByID(todoID) as TodoSchemaType;
      return todo;
    });

    this.mutateTodosAndRender(todos);
  }
}
