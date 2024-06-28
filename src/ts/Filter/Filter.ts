import { TodoStatus } from "../Todo/TodoList";
import { isValidFilter } from "./helpers";
import queryString from "query-string";

export class Filter {
  private parentElements = document.querySelectorAll(".filters");
  private filterButtons =
    document.querySelectorAll<HTMLButtonElement>(".btn--filter");

  global_filter: TodoStatus | "all" = "all";

  constructor() {
    this.addEventListeners();

    this.loadFilterFromURL();

    this.handleFiltersButtonUI();
  }

  private removeFiltersButtonActiveUI() {
    this.filterButtons?.forEach((filterButton) => {
      filterButton?.classList.remove("btn--filter-active");
    });
  }

  private handleFiltersButtonUI() {
    this.removeFiltersButtonActiveUI();

    this.filterButtons?.forEach((filterButton) => {
      const filterState = filterButton.getAttribute("data-filter");

      if (filterState === this.global_filter) {
        filterButton?.classList.add("btn--filter-active");
      }
    });
  }

  private addEventListeners() {
    this.parentElements.forEach((parentElement) => {
      parentElement?.addEventListener("click", ({ target }) => {
        if (!(target instanceof HTMLButtonElement)) return;

        if (target.classList.contains("btn--filter")) {
          this.changeFilter(target);
          this.handleFiltersButtonUI();
        }
      });
    });
  }

  private loadFilterFromURL() {
    const parsed = queryString.parse(location.search);

    if (!parsed.filter) return;
    if (typeof parsed.filter !== "string") return;
    if (!isValidFilter(parsed.filter)) return;

    this.global_filter = parsed.filter;
  }

  setFilterToURL(filter?: TodoStatus | "all") {
    const parsed = queryString.parse(location.search);

    parsed.filter = filter ? filter : this.global_filter;

    const stringified = queryString.stringify(parsed);

    location.search = stringified;
  }

  private changeFilter(target: HTMLButtonElement) {
    const filterState = target.getAttribute("data-filter");

    if (!filterState) return;

    if (!isValidFilter(filterState)) return;

    this.global_filter = filterState;

    this.setFilterToURL();
    this.handleFiltersButtonUI();
  }
}
