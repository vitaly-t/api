import serialize from "./utils/serialize.js";

const editForm = {
  init() {
    // bind event listener for publish buttons clicks
    const submitButtonEls = document.querySelectorAll("[type=submit]");
    for (let i = 0; i < submitButtonEls.length; i++) {
      submitButtonEls[i].addEventListener("click", event => {
        this.sendFormData(event);
      });
    }
  },

  sendFormData(event) {
    event.preventDefault();
    const formEl = event.target.closest("form");
    const formData = serialize(formEl);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', formEl.getAttribute("action"), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== xhr.DONE) return;

      const response = JSON.parse(xhr.response);

      if (response.success) {
        alert('saved successfully');
        console.log("success response", response)
      } else {
        alert('something went wrong');
        console.log("error response", response)
      }
    };
    xhr.send(formData);
  },
}

export default editForm;
