import { ThemeProvider } from "./ts/Theme/ThemeProvider";
import { TodoList } from "./ts/Todo/TodoList";
import { TodoListServices } from "./ts/Todo/TodoListServices";
import { Form } from "./ts/UI/Form";

class App {
  protected todoList = new TodoList();
  protected todoServices = new TodoListServices(this.todoList);
  protected form = new Form(this.todoServices);
  protected themeProvider = new ThemeProvider();

  initialize() {
    this.form.initialize();
    this.themeProvider.initialize();
  }
}

export default new App();
