import * as focusTrap from "focus-trap";
import { UI } from "./UI";

export class Modal extends UI {
  private parentElement = document.querySelector<HTMLDivElement>(
    "[data-global-modal]"
  );
  private modalElements = {
    overlay: document.querySelector("[data-overlay]"),
    title: document.querySelector("[data-modal-title]"),
    description: document.querySelector<HTMLDivElement>(
      "[data-modal-description]"
    ),
  };

  private trap: focusTrap.FocusTrap | null = null;
  private confirmFunction: Function | null = null;

  private config = {
    DATA_ATTRIBUTE_CLOSE_MODAL: "data-modal-close",
    DATA_ATTRIBUTE_CONFIRM_MODAL: "data-modal-confirm",
    KEY_TO_CLOSE_MODAL: "Escape",
    MODAL_HIDDEN_CLASS: "modal-hidden",
    transition_time: 300,
  };

  constructor() {
    super();

    this.initTrap();
    this.addEventListeners();
  }

  private initTrap() {
    if (!this.parentElement) return;

    this.trap = focusTrap.createFocusTrap(this.parentElement);
  }

  private isValidModalAndKeyToCloseModal(key: string) {
    const isEscape = key === this.config.KEY_TO_CLOSE_MODAL;

    if (!isEscape) return false;

    if (this.parentElement?.classList.contains(this.config.MODAL_HIDDEN_CLASS))
      return false;

    return true;
  }

  private addEventListeners() {
    this.parentElement?.addEventListener("click", ({ target }) => {
      if (!(target instanceof HTMLButtonElement)) return;

      if (target.hasAttribute(this.config.DATA_ATTRIBUTE_CLOSE_MODAL)) {
        this.closeModal();
      }

      if (target.hasAttribute(this.config.DATA_ATTRIBUTE_CONFIRM_MODAL)) {
        this.confirmAction();
      }
    });

    document.body.addEventListener("keydown", ({ key }) => {
      if (this.isValidModalAndKeyToCloseModal(key)) {
        this.closeModal();
      }
    });

    this.modalElements.overlay?.addEventListener("click", () => {
      this.closeModal();
    });
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
    this.clearElement(this.modalElements.description);
    document.body.setAttribute("data-modal", "true");
    this.parentElement?.classList.remove("modal-hidden");

    if (!this.modalElements.title) return;
    this.modalElements.title.textContent = title;

    if (!this.modalElements.description) return;
    this.modalElements.description?.insertAdjacentHTML("afterbegin", content);

    this.confirmFunction = confirmFunction;

    setTimeout(() => {
      this.trap?.activate();
    }, this.config.transition_time);
  }

  closeModal() {
    this.parentElement?.classList.add("modal-hidden");
    document.body.removeAttribute("data-modal");

    this.trap?.deactivate();
  }

  confirmAction() {
    if (!this.confirmFunction) return;

    this.confirmFunction();
  }
}
