import { z } from "zod";
import { TodoStatus } from "./TodoList";
import { UI } from "./UI";
import { TodoSchema } from "./schema/TodoSchema";

export class Form {
  private formElement = document.querySelector("[data-form]");
  private formError =
    document.querySelector<HTMLParagraphElement>("[data-form-error]");

  private todoStatusElement = document.querySelector<HTMLButtonElement>(
    "[data-form-todo-status]"
  );
  private todoTitleElement = document.querySelector<HTMLInputElement>(
    "[data-form-todo-title]"
  );

  private ui = new UI();

  private todoStatus = "active";

  initialize() {
    this.addEventListeners();
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
      const validTodoData = TodoSchema.parse({ title, status });

      this.hideError();
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const message = err.issues.map((issue) => issue.message).join("");
        this.setFormError(message);
      }
    }
  }

  private changeTodoStatus() {
    if (!this.todoStatusElement) return;

    this.todoStatus = this.todoStatus === "active" ? "complete" : "active";

    this.ui.manageTodoButtonUI(this.todoStatusElement, this.todoStatus);
  }

  private addEventListeners() {
    this.formElement?.addEventListener("submit", (ev) => {
      ev.preventDefault();

      this.getFormValues();
    });

    this.todoStatusElement?.addEventListener("click", () => {
      this.changeTodoStatus();
    });
  }
}
