import { TodoSchemaType } from "./TodoSchema";

const selectOptions = [
  {
    id: 1,
    value: "complete",
    title: "Complete",
  },
  {
    id: 2,
    value: "active",
    title: "Active",
  },
];

export class TodoDOMHelper {
  setEmptyTodosContainer(container: Element | null) {
    if (!container) return;

    const emptyContent = /* HTML */ `
      <div class="todo-list__item">
        <p class="todo-list__empty">No tasks found.</p>
      </div>
    `;

    container.insertAdjacentHTML("afterbegin", emptyContent);
  }

  generateDeleteTodoModalContent() {
    const deleteTodoModalContent = /* HTML */ `
      <p>Are you sure you want to delete this task?</p>
      <p><strong>Action is irreversible!</strong></p>
    `;

    return deleteTodoModalContent;
  }

  generateEditTodoModalContent(todo: TodoSchemaType) {
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
}
