import * as focusTrap from "focus-trap";
import { UI } from "./UI";

export class Modal extends UI {
  private parentElement = document.querySelector<HTMLDivElement>(
    "[data-global-modal]"
  );

  private overlay = document.querySelector("[data-overlay]");
  private modalTitle = document.querySelector("[data-modal-title]");
  private modalDescription = document.querySelector<HTMLDivElement>(
    "[data-modal-description]"
  );
  private trap: focusTrap.FocusTrap | null = null;
  private transition_time = 300;
  private confirmFunction: Function | null = null;

  constructor() {
    super();
    this.initTrap();

    this.addEventListeners();
  }

  private initTrap() {
    if (!this.parentElement) return;

    this.trap = focusTrap.createFocusTrap(this.parentElement);
  }

  private addEventListeners() {
    this.parentElement?.addEventListener("click", ({ target }) => {
      if (!(target instanceof HTMLButtonElement)) return;

      if (target.classList.contains("btn--modal")) {
        this.closeModal();
      }

      if (target.classList.contains("btn--close")) {
        this.closeModal();
      }

      if (target.classList.contains("btn--confirm")) {
        this.confirmAction();
      }
    });

    document.body.addEventListener("keydown", ({ key }) => {
      if (
        key === "Escape" &&
        !this.parentElement?.classList.contains("modal-hidden")
      ) {
        this.closeModal();
      }
    });

    this.overlay?.addEventListener("click", this.closeModal.bind(this));
  }

  openModal({
    title,
    content,
    confirmFunction,
  }: {
    title: string;
    content: string;
    confirmFunction: (id?: string) => void;
  }) {
    this.clearElement(this.modalDescription);

    this.parentElement?.classList.remove("modal-hidden");

    if (!this.modalTitle) return;
    this.modalTitle.textContent = title;

    if (!this.modalDescription) return;
    this.modalDescription?.insertAdjacentHTML("afterbegin", content);

    this.confirmFunction = confirmFunction;

    setTimeout(() => {
      this.trap?.activate();
    }, this.transition_time);
  }

  closeModal() {
    this.parentElement?.classList.add("modal-hidden");
    this.trap?.deactivate();
  }

  confirmAction() {
    if (!this.confirmFunction) return;

    this.confirmFunction();
  }
}
