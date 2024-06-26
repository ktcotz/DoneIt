import { TodoSchemaType } from "./TodoSchema";

export class Todo {
  constructor(private todo: TodoSchemaType) {}

  renderContent() {
    const todoContent = /* HTML */ `
      <div
        class="todo-list__item ${this.todo.status === "complete"
          ? "todo-list__item--complete"
          : ""}"
        data-item="${this.todo.id}"
      >
        <button
          class="btn btn--edit ${this.todo.status === "complete"
            ? "btn--complete"
            : ""}"
          aria-label="Change todo status"
          data-handle-item="${this.todo.id}"
          data-edit-button
        >
          ${this.todo.status === "complete"
            ? `<img src="./assets/images/icon-check.svg" alt="" class="btn__image" />`
            : "&nbsp;"}
        </button>
        <p class="todo-list__item-title">${this.todo.title}</p>
        <div class="todo-list__actions">
          <button
            class="btn btn--action btn--global-edit"
            aria-label="Edit todo"
            data-handle-item="${this.todo.id}"
            data-global-edit
          >
            <img
              src="./assets/images/icon-edit.svg"
              alt=""
              class="btn__icon btn__icon--action"
            />
          </button>
          <button
            class="btn btn--action btn--global-delete"
            aria-label="Delete todo"
            data-handle-item="${this.todo.id}"
            data-global-delete
          >
            <img
              src="./assets/images/icon-cross.svg"
              alt=""
              class="btn__icon btn__icon--action"
            />
          </button>
        </div>
      </div>
    `;

    return todoContent;
  }
}
