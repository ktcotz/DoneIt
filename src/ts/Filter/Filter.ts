import { FilterSchema, FilterSchemaType } from "./FilterSchema";
import queryString from "query-string";

export class Filter {
  private parentElements = document.querySelectorAll(".filters");
  private filterElements = {
    buttons: document.querySelectorAll(".btn--filter"),
  };

  private config = {
    ACTIVE_FILTER_CLASS: "btn--filter-active",
    DATA_ATTRIBUTE_FILTER_BUTTON: "data-filter",
  };

  global_filter: FilterSchemaType = "all";

  constructor() {
    this.addEventListeners();
    this.loadFilterFromURL();
    this.handleFiltersButtonUI();
  }

  private removeFiltersButtonActiveUI() {
    this.filterElements.buttons?.forEach((filterButton) => {
      filterButton?.classList.remove(this.config.ACTIVE_FILTER_CLASS);
    });
  }

  private handleFiltersButtonUI() {
    this.removeFiltersButtonActiveUI();

    this.filterElements.buttons?.forEach((filterButton) => {
      const filterState = filterButton.getAttribute(
        this.config.DATA_ATTRIBUTE_FILTER_BUTTON
      );

      if (filterState === this.global_filter) {
        filterButton?.classList.add(this.config.ACTIVE_FILTER_CLASS);
      }
    });
  }

  private addEventListeners() {
    this.parentElements.forEach((parentElement) => {
      parentElement?.addEventListener("click", ({ target }) => {
        if (!(target instanceof HTMLButtonElement)) return;
        if (!target.hasAttribute(this.config.DATA_ATTRIBUTE_FILTER_BUTTON))
          return;

        this.changeFilter(target);
        this.handleFiltersButtonUI();
      });
    });
  }

  private changeFilter(target: HTMLButtonElement) {
    const filterState = target.getAttribute(
      this.config.DATA_ATTRIBUTE_FILTER_BUTTON
    );
    const isValidFilter = FilterSchema.parse(filterState);

    this.global_filter = isValidFilter;

    this.setFilterToURL(this.global_filter);
    this.handleFiltersButtonUI();
  }

  private loadFilterFromURL() {
    const parsed = queryString.parse(location.search);
    const isValidFilter = FilterSchema.parse(parsed.filter);

    this.global_filter = isValidFilter;
  }

  setFilterToURL(filter: FilterSchemaType) {
    const parsed = queryString.parse(location.search);

    parsed.filter = filter ? filter : this.global_filter;

    const stringified = queryString.stringify(parsed);

    location.search = stringified;
  }
}
