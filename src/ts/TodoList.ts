import { Form } from "./Form";

export enum TodoStatus {
  Active = "active",
  Complete = "complete",
}

export class TodoList {
  private form = new Form();

  initialize() {
    this.form.initialize();
  }
}
