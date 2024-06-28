import { TodoStatus } from "./TodoList";

export const isValidStatus = (status: string): status is TodoStatus => {
  return status === "complete" || status === "active";
};
