import { updateUrlParams } from "./utils/utils.js";

// todo:
// - update button chip to show if there are selected filters or not
// - adjust placement of filter list pop over if near edge of screen
// - add clear all button to pop overs and next to filter search button
// - on submit add selected filters as params to url
// - on load select inputs and chip buttons that correspond to the url params

const toArray = (nodeList) => Array.prototype.slice.call(nodeList);

const searchFilters = {
  init() {
    this.searchFiltersFormEl = document.querySelector(".js-search-filters");

    if (!this.searchFiltersFormEl) return;

    this.searchFiltersListEl = document.querySelector(".js-search-filters-chip-list");
    this.checkboxEls = toArray(this.searchFiltersFormEl.querySelectorAll("input[type=checkbox]"));

    const chipButtonEls = toArray(
      this.searchFiltersListEl.querySelectorAll(".js-search-filters-chip")
    );
    chipButtonEls.forEach(el => {
      el.addEventListener("click", e => {
        this.handleChipButtonClick(e);
      });
    });

    this.searchFiltersFormEl.addEventListener("submit", e => {
      this.handleFormSubmit(e);
    });

    this.checkboxEls.forEach(el => {
      el.addEventListener("change", (e) => {
        this.handleCheckBoxChange(e);
      });
    });
  },

  getState() {
    const selectedFilters = {};
    this.checkboxEls.forEach(el => {
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

  handleCheckBoxChange(e) {
    const selectedCheckbox = e.target;
    const currentKeysList = selectedCheckbox.closest(".js-keys-list");
    const parentButton = selectedCheckbox.closest(".js-search-filters-chip-list-item").querySelector(".js-search-filters-chip");

    // if there are any selected checkboxes in the current list, show selected button state,
    // otherwise show deselected button state
    if (currentKeysList.querySelectorAll("input:checked").length > 0) {
      parentButton.classList.add("search-filters-chip-selected");
    } else {
      parentButton.classList.remove("search-filters-chip-selected");
    }
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const selectedFilters = this.getState();
  },

  handleChipButtonClick(e) {
    e.preventDefault();

    const allPopOvers = toArray(document.querySelectorAll(".js-filter-list-pop-over"));
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
};

export default searchFilters;
