import * as focusTrap from "focus-trap";
import { UI } from "./UI";

type OpenModalArguments = {
  title: string;
  content: string;
  confirmFunction: <T>(arg: T) => void;
};

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

  private setOpenModalContent(title: string, content: string) {
    if (!this.modalElements.title) return;
    this.modalElements.title.textContent = title;

    if (!this.modalElements.description) return;
    this.modalElements.description?.insertAdjacentHTML("afterbegin", content);
  }

  private confirmAction() {
    if (!this.confirmFunction) return;
    this.confirmFunction();
  }

  openModal({ title, content, confirmFunction }: OpenModalArguments) {
    this.clearElement(this.modalElements.description);

    document.body.setAttribute("data-modal", "true");
    this.parentElement?.classList.remove(this.config.MODAL_HIDDEN_CLASS);

    this.setOpenModalContent(title, content);
    this.confirmFunction = confirmFunction;

    setTimeout(() => {
      this.trap?.activate();
    }, this.config.transition_time);
  }

  closeModal() {
    this.parentElement?.classList.add(this.config.MODAL_HIDDEN_CLASS);
    document.body.removeAttribute("data-modal");
    this.trap?.deactivate();
  }
}
