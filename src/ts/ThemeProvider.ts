/*
    FLOW:

    1. Pobieram user preferences.
     Jeżeli true to ustaw na dark mode. Jeżeli nie to ustaw na light mode.

*/

enum Theme {
  Light = "light",
  Dark = "dark",
}

export class ThemeProvider {
  private themeButton = document.querySelector("[data-theme-button]");
  private themeButtonIcon = document.querySelector("[data-theme-icon]");
  private currentTheme = Theme.Dark;

  initialize() {
    this.addEventListeners();
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

    this.setUITheme();
  }

  private addEventListeners() {
    this.themeButton?.addEventListener("click", () => {
      this.changeCurrentTheme();
    });
  }
}
