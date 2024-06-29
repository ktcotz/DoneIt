import { Theme } from "./ThemeProvider";

export class ThemeDOMHelper {
  changeThemeIcon(iconElement: Element | null, currentTheme: Theme) {
    iconElement?.setAttribute(
      "src",
      `./assets/images/icon-${currentTheme === Theme.Dark ? "sun" : "moon"}.svg`
    );
  }

  changeButtonLabel(parentElement: Element | null, currentTheme: Theme) {
    parentElement?.setAttribute(
      "aria-label",
      `Change theme to ${currentTheme === Theme.Dark ? "light" : "dark"}`
    );
  }
}
