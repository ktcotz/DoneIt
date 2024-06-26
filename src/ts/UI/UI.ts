import { TodoStatus } from "../Todo/TodoSchema";

export class UI {
  protected clearElement<T extends HTMLElement>(element: T | null) {
    if (!element) return;

    element.innerHTML = "";
  }

  protected clearInputs(inputs: (HTMLInputElement | null)[]) {
    inputs.forEach((input) => {
      if (!input) return;

      input.value = "";
    });
  }

  protected setElementFocus<T extends HTMLElement>(element: T | null) {
    if (!element) return;

    element.focus();
  }

  protected manageTodoButtonUI(button: HTMLButtonElement, status: TodoStatus) {
    button.setAttribute(
      "aria-label",
      `Change todo status to ${status === "active" ? "complete" : "active"}`
    );

    if (status === "complete") {
      button?.classList.add("btn--complete");
      button.innerHTML = /* HTML */ `
        <img src="./assets/images/icon-check.svg" alt="" class="btn__image" />
      `;
    } else {
      button?.classList.remove("btn--complete");
      button.innerHTML = "&nbsp;";
    }
  }
}
