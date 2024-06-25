import "./scss/style.scss";
import { Form } from "./ts/UI/Form";
import { ThemeProvider } from "./ts/Theme/ThemeProvider";
import { TodoList } from "./ts/Todo/TodoList";
import { TodoListServices } from "./ts/Todo/TodoListServices";

const todoList = new TodoList();
const todoServices = new TodoListServices(todoList);
const form = new Form(todoServices);

const init = () => {
  new ThemeProvider().initialize();
  form.initialize();
};

init();
