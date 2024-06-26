import { TodoSchemaType } from "./TodoSchema";

export class Todo {
  constructor(private todo: TodoSchemaType) {}

  renderContent() {
    console.log(this.todo);
    const todoContent = /* HTML */ `
      <div
        class="todo-list__item ${this.todo.status === "complete"
          ? "todo-list__item--complete"
          : ""}"
      >
        <button
          class="btn btn--edit ${this.todo.status === "complete"
            ? "btn--complete"
            : ""}"
          aria-label="Change todo status"
        >
          ${this.todo.status === "complete"
            ? `<img src="./assets/images/icon-check.svg" alt="" class="btn__image" />`
            : "&nbsp;"}
        </button>
        <p class="todo-list__item-title">${this.todo.title}</p>
      </div>
    `;

    return todoContent;
  }
}
