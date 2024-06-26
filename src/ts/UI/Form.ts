import { z } from "zod";
import { UI } from "./UI";
import { TodoSchema } from "../Todo/TodoSchema";
import { TodoStatus } from "../Todo/TodoList";
import { TodoListServices } from "../Todo/TodoListServices";

export class Form {
  private formElement = document.querySelector("[data-form]");
  private formError =
    document.querySelector<HTMLParagraphElement>("[data-form-error]");
  private submitButton =
    document.querySelector<HTMLButtonElement>("[data-form-submit]");

  private todoStatusElement = document.querySelector<HTMLButtonElement>(
    "[data-form-todo-status]"
  );
  private todoTitleElement = document.querySelector<HTMLInputElement>(
    "[data-form-todo-title]"
  );

  private todoStatus = TodoStatus.Active;

  private ui = new UI();

  constructor(private todoListServices: TodoListServices) {}

  initialize() {
    this.addEventListeners();
    this.ui.setElementFocus(this.todoTitleElement);
  }

  private hideError() {
    this.formElement?.classList.remove("form--error");
    this.ui.clearElement(this.formError);
  }

  private setFormError(message: string) {
    if (!this.formError) return;

    this.formElement?.classList.add("form--error");
    this.formError.textContent = message;
  }

  private getFormValues() {
    if (!this.todoStatusElement || !this.todoTitleElement) return;

    const title = this.todoTitleElement.value;
    const status = this.todoStatus;

    try {
      const validTodoData = TodoSchema.parse({
        title,
        status,
        id: Math.random().toString(),
      });

      return validTodoData;
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const message = err.issues.map((issue) => issue.message).join("");
        this.setFormError(message);
      }
    }
  }

  private setSuccessSubmitButton() {
    if (!this.submitButton) return;

    const content = this.submitButton.querySelector("[data-submit-content]");

    if (!content) return;

    content.textContent = "Success!";
    this.submitButton?.classList.add("btn--success");

    const SUCCESS_SECONDS_TIMEOUT = 1000;

    setTimeout(() => {
      content.textContent = "Add todo";
      this.submitButton?.classList.remove("btn--success");
    }, SUCCESS_SECONDS_TIMEOUT);
  }

  private handleAddTodo() {
    const data = this.getFormValues();

    if (!data) return;

    this.todoListServices.addTodo(data);

    this.hideError();
    this.setSuccessSubmitButton();

    if (!this.todoTitleElement) return;
    this.ui.clearInputs([this.todoTitleElement]);
  }

  private changeTodoStatus() {
    if (!this.todoStatusElement) return;

    this.todoStatus =
      this.todoStatus === TodoStatus.Active
        ? TodoStatus.Complete
        : TodoStatus.Active;

    this.ui.manageTodoButtonUI(this.todoStatusElement, this.todoStatus);
  }

  private addEventListeners() {
    this.formElement?.addEventListener("submit", (ev) => {
      ev.preventDefault();

      this.handleAddTodo();
    });

    this.todoStatusElement?.addEventListener("click", () => {
      this.changeTodoStatus();
    });
  }
}
