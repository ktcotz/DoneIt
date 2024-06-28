import { TodoStatus } from "../Todo/TodoList";

export const isValidFilter = (status: string): status is TodoStatus | "all" => {
  return status === "complete" || status === "active" || status === "all";
};
