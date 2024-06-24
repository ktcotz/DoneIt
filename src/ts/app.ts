import { ThemeProvider } from "./ThemeProvider";
import { TodoList } from "./TodoList";

export class App {
  initialize() {
    new ThemeProvider().initialize();
    new TodoList().initialize();
  }
}
