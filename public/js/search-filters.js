import { updateUrlParams } from "./utils/utils.js";

// todo:
// - adjust placement of filter list pop over if near edge of screen
// - on submit add selected filters as params to url
// - on load select inputs and chip buttons that correspond to the url params

const toArray = (nodeList) => Array.prototype.slice.call(nodeList);

const searchFilters = {
  init() {
    this.searchFiltersFormEl = document.querySelector(".js-search-filters");

    if (!this.searchFiltersFormEl) return;

    this.searchFiltersListEl = document.querySelector(".js-search-filters-chip-list");
    this.checkboxEls = toArray(this.searchFiltersFormEl.querySelectorAll("input[type=checkbox]"));

    this.chipButtonEls = toArray(
      this.searchFiltersListEl.querySelectorAll(".js-search-filters-chip")
    );

    this.chipButtonEls.forEach(el => {
      el.addEventListener("click", e => this.handleChipButtonClick(e));
    });

    this.searchFiltersFormEl.addEventListener("submit", e => {
      this.handleFormSubmit(e);
    });

    const clearAllLink = this.searchFiltersFormEl.querySelector(".js-clear-all-link");
    clearAllLink.addEventListener("click", e => this.handleClearAllClick(e));

    const clearSectionLinks = toArray(
      this.searchFiltersFormEl.querySelectorAll(".js-clear-section-link")
    );
    clearSectionLinks.forEach(el => {
      el.addEventListener("click", e => this.handleClearAllForSection(e));
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

  updateChipButtonsState() {
    this.chipButtonEls.forEach(el => {
      const hasCheckedItems = el.closest(".js-search-filters-chip-list-item")
        .querySelectorAll("input:checked").length > 0;
      if (hasCheckedItems) {
        el.classList.add("search-filters-chip-selected");
      } else {
        el.classList.remove("search-filters-chip-selected");
      }
    });
  },

  handleClearAllClick(e) {
    e.preventDefault();
    const allCheckboxes = toArray(
      this.searchFiltersFormEl.querySelectorAll("input:checked")
    );
    allCheckboxes.forEach(el => el.checked = false);
    this.updateChipButtonsState();
  },

  handleClearAllForSection(e) {
    e.preventDefault();
    const category = e.target.getAttribute("data-field-name");
    const allCheckboxesForSection = toArray(
      this.searchFiltersFormEl.querySelector(`.js-keys-list[data-field-name=${category}`).querySelectorAll("input")
    );
    allCheckboxesForSection.forEach(el => el.checked = false);
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const selectedFilters = this.getState();
  },

  handleChipButtonClick(e) {
    e.preventDefault();

    const allPopOvers = toArray(document.querySelectorAll(".js-filter-list-pop-over"));
    const currentPopOverEl = e.target.closest("li").querySelector(".js-filter-list-pop-over");
    const currentButton = e.target;

    // close all other open pop overs before opening the current clicked one
    allPopOvers.forEach(el => {
      if (el !== currentPopOverEl) {
        el.classList.remove("show-filter-list-popover");
      }
    });

    // remove open class from chip button before opening a new one
    this.chipButtonEls.forEach(el => el.classList.remove("search-filters-chip-open"));

    this.updateChipButtonsState();

    // toggle current popover if you click the same chip button again
    if (currentPopOverEl.classList.contains("show-filter-list-popover")) {
      // hide popover
      currentButton.classList.remove("search-filters-chip-open")
      currentPopOverEl.classList.remove("show-filter-list-popover");
      this.updateChipButtonsState();
      document.activeElement.blur();
    } else {
      // show popover
      currentButton.classList.add("search-filters-chip-open")
      currentPopOverEl.classList.add("show-filter-list-popover");
    }
  }
};

export default searchFilters;
