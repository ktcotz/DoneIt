import { TodoStatus } from "./TodoSchema";

export const isValidStatus = (status: string): status is TodoStatus => {
  return status === "complete" || status === "active";
};
