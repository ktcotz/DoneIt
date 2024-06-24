export class UI {
  manageTodoButtonUI(button: HTMLButtonElement, status: string) {
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

  clearElement<T extends HTMLElement>(element: T | null) {
    if (!element) return;

    element.innerHTML = "";
  }
}
