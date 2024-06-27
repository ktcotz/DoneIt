export class Modal {
  private parentElement = document.querySelector("[data-global-modal]");
  private overlay = document.querySelector("[data-overlay]");

  constructor() {
    this.addEventListeners();
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

  openModal() {
    this.parentElement?.classList.remove("modal-hidden");
  }

  closeModal() {
    this.parentElement?.classList.add("modal-hidden");
  }
}
