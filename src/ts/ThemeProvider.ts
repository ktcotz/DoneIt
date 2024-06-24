import { Storage } from "./Storage";

enum Theme {
  Light = "light",
  Dark = "dark",
}

export class ThemeProvider {
  private themeButton = document.querySelector("[data-theme-button]");
  private themeButtonIcon = document.querySelector("[data-theme-icon]");
  private currentTheme = Theme.Dark;
  private storage = new Storage<Theme>();
  private storage_key = "theme";

  initialize() {
    this.addEventListeners();
    this.getStorageTheme();
  }

  getStorageTheme() {
    const storageTheme = this.storage.getFromStorage(this.storage_key);

    if (storageTheme) {
      this.currentTheme = storageTheme;
      return this.setUITheme();
    }

    this.getUserPreferences();
  }

  private getUserPreferences() {
    const themePreference = window.matchMedia("(prefers-color-scheme:dark)");
    const isDarkPreference = themePreference.matches;

    this.currentTheme = isDarkPreference ? Theme.Dark : Theme.Light;

    this.setUITheme();
  }

  private setTheme() {
    document.body.setAttribute("data-theme", this.currentTheme);
  }

  private changeThemeIcon() {
    this.themeButtonIcon?.setAttribute(
      "src",
      `./assets/images/icon-${
        this.currentTheme === Theme.Dark ? "sun" : "moon"
      }.svg`
    );
  }

  private changeButtonLabel() {
    this.themeButton?.setAttribute(
      "aria-label",
      `Change theme to ${this.currentTheme === Theme.Dark ? "light" : "dark"}`
    );
  }

  private setUITheme() {
    this.setTheme();
    this.changeThemeIcon();
    this.changeButtonLabel();
  }

  private changeCurrentTheme() {
    const changedTheme =
      this.currentTheme === Theme.Dark ? Theme.Light : Theme.Dark;

    this.currentTheme = changedTheme;
    this.storage.saveToStorage(this.storage_key, this.currentTheme);

    this.setUITheme();
  }

  private addEventListeners() {
    this.themeButton?.addEventListener("click", () => {
      this.changeCurrentTheme();
    });
  }
}
