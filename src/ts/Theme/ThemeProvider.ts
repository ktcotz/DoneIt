import { Storage } from "../Storage/Storage";
import { ThemeDOMHelper } from "./ThemeDOMHelper";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export class ThemeProvider {
  private parentElement = document.querySelector("[data-theme-button]");
  private themeElements = {
    icon: document.querySelector("[data-theme-icon]"),
  };

  private config = {
    currentTheme: Theme.Dark,
    storage_key: "theme",
  };

  private storage = new Storage<Theme>();
  private theme_dom_helper = new ThemeDOMHelper();

  initialize() {
    this.addEventListeners();
    this.getStorageTheme();
  }

  private getStorageTheme() {
    const storageTheme = this.storage.getFromStorage(this.config.storage_key);

    if (storageTheme) {
      this.config.currentTheme = storageTheme;
      return this.setUITheme();
    }

    this.getUserPreferences();
  }

  private getUserPreferences() {
    const themePreference = window.matchMedia("(prefers-color-scheme:dark)");
    const isDarkPreference = themePreference.matches;

    this.config.currentTheme = isDarkPreference ? Theme.Dark : Theme.Light;

    this.setUITheme();
  }

  private setUITheme() {
    document.body.setAttribute("data-theme", this.config.currentTheme);
    this.theme_dom_helper.changeThemeIcon(
      this.themeElements.icon,
      this.config.currentTheme
    );
    this.theme_dom_helper.changeButtonLabel(
      this.parentElement,
      this.config.currentTheme
    );
  }

  private changeCurrentTheme() {
    const changedTheme =
      this.config.currentTheme === Theme.Dark ? Theme.Light : Theme.Dark;

    this.config.currentTheme = changedTheme;
    this.storage.saveToStorage(
      this.config.storage_key,
      this.config.currentTheme
    );

    this.setUITheme();
  }

  private addEventListeners() {
    this.parentElement?.addEventListener("click", () => {
      this.changeCurrentTheme();
    });
  }
}
