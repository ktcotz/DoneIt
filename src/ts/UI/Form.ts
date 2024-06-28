import { z } from "zod";
import { UI } from "./UI";
import { TodoSchema } from "../Todo/TodoSchema";
import { TodoStatus } from "../Todo/TodoList";
import { TodoListServices } from "../Todo/TodoListServices";

export class Form {
  private formElement = document.querySelector("[data-form]");
  private formElements = {
    todoTitle: document.querySelector<HTMLInputElement>(
      "[data-form-todo-title]"
    ),
    todoStatus: document.querySelector<HTMLButtonElement>(
      "[data-form-todo-status]"
    ),

    error: document.querySelector<HTMLParagraphElement>("[data-form-error]"),
    submitButton:
      document.querySelector<HTMLButtonElement>("[data-form-submit]"),
  };

  private todoStatus = TodoStatus.Active;

  private config = {
    ERROR_CLASS: "form--error",
    BTN_SUCCESS_CLASS: "btn--success",
    SUCCESS_SECONDS_TIMEOUT: 1000,
  };

  private ui = new UI();

  constructor(private todoListServices: TodoListServices) {}

  initialize() {
    this.addEventListeners();
    this.ui.setElementFocus(this.formElements.todoTitle);
  }

  private hideError() {
    this.formElement?.classList.remove(this.config.ERROR_CLASS);
    this.ui.clearElement(this.formElements.error);
  }

  private setFormError(message: string) {
    if (!this.formElements.error) return;

    this.formElement?.classList.add(this.config.ERROR_CLASS);
    this.formElements.error.textContent = message;
  }

  private getFormValues() {
    if (!this.formElements.todoTitle || !this.formElements.todoStatus) return;

    const title = this.formElements.todoTitle.value;
    const status = this.todoStatus;

    try {
      const validTodoData = TodoSchema.parse({
        title,
        status,
        id: Math.random().toString().slice(0, 10),
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
    if (!this.formElements.submitButton) return;

    const content = this.formElements.submitButton.querySelector(
      "[data-submit-content]"
    );

    if (!content) return;

    content.textContent = "Success!";
    this.formElements.submitButton?.classList.add(
      this.config.BTN_SUCCESS_CLASS
    );

    setTimeout(() => {
      content.textContent = "Add todo";
      this.formElements.submitButton?.classList.remove(
        this.config.BTN_SUCCESS_CLASS
      );
    }, this.config.SUCCESS_SECONDS_TIMEOUT);
  }

  private handleAddTodo() {
    const data = this.getFormValues();

    if (!data) return;

    this.todoListServices.addTodo(data);

    this.hideError();
    this.setSuccessSubmitButton();
    this.ui.clearInputs([this.formElements.todoTitle]);
  }

  private changeTodoStatus() {
    if (!this.formElements.todoStatus) return;

    this.todoStatus =
      this.todoStatus === TodoStatus.Active
        ? TodoStatus.Complete
        : TodoStatus.Active;

    this.ui.manageTodoButtonUI(this.formElements.todoStatus, this.todoStatus);
  }

  private addEventListeners() {
    this.formElement?.addEventListener("submit", (ev) => {
      ev.preventDefault();

      this.handleAddTodo();
    });

    this.formElements.todoStatus?.addEventListener("click", () => {
      this.changeTodoStatus();
    });
  }
}
