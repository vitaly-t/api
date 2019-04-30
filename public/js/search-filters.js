import { updateUrlParams } from "./utils/utils.js";

// todo:
// - update button chip to show if there are selected filters or not
// - adjust placement of filter list pop over if near edge of screen
// - add clear all button to pop overs and next to filter search button
// - on submit add selected filters as params to url
// - add search filters chip/button that toggles the search filter ui open or closed

const searchFilters = {
  init() {
    this.searchFiltersFormEl = document.querySelector(".js-search-filters");
    this.searchFiltersListEl = document.querySelector(".js-search-filters-chip-list");

    if (!this.searchFiltersListEl) return;

    this.searchFiltersListEl.addEventListener("click", e => {
      this.handleChipButtonClick(e);
    });

    this.searchFiltersFormEl.addEventListener("submit", e => {
      this.handleFormSubmit(e);
    });
  },

  getCurrentState() {
    const checkboxEls = Array.prototype.slice.call(
      this.searchFiltersFormEl.querySelectorAll("input[type=checkbox]")
    );

    const selectedFilters = {};
    checkboxEls.forEach(el => {
      if (el.checked) {
        const fieldName = el.getAttribute("data-field-name");
        const filterName = el.getAttribute("name");
        if (Array.isArray(selectedFilters[fieldName])) {
          selectedFilters[fieldName].push(filterName);
        } else {
          selectedFilters[fieldName] = [filterName];
        }
      }
    });
    console.log("selectedFilters", selectedFilters)
    return selectedFilters;
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const selectedFilters = this.getCurrentState();
  },

  handleChipButtonClick(e) {
    if (e.target.closest("button")) {
      e.preventDefault();

      const allPopOvers = Array.prototype.slice.call(
        document.querySelectorAll(".js-filter-list-pop-over")
      );
      const currentPopOverEl = e.target.closest("li").querySelector(".js-filter-list-pop-over");

      // close all other open pop overs before opening the current clicked one
      allPopOvers.forEach(el => {
        if (el !== currentPopOverEl) {
          el.classList.remove("show-filter-list-popover");
        }
      });

      // toggle current popover if you click the same chip button again
      if (currentPopOverEl.classList.contains("show-filter-list-popover")) {
        // hide popover
        currentPopOverEl.classList.remove("show-filter-list-popover");
      } else {
        // show popover
        currentPopOverEl.classList.add("show-filter-list-popover");
      }
    }
  }
};

export default searchFilters;
