/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
var serialize = function (form) {

  // Setup our serialized data
  var serialized = [];

  // Loop through each field in the form
  for (var i = 0; i < form.elements.length; i++) {

    var field = form.elements[i];

    // don't send up the value of the multi-select select field since we
    // are tracking the list of values in an array of hidden text fields
    if (field.classList.contains("js-edit-multi-select")) continue;

    // don't include temporary field values
    if (field.name.startsWith("temporary-")) continue;

    // Don't serialize fields without a name, submits, buttons and reset inputs, and disabled fields
    if (!field.name || field.disabled || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

    // If a multi-select, get all selections
    if (field.type === 'select-multiple') {
      for (var n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
      }
    }

    // convert rich text fields
    if (field.getAttribute("data-field-type") === "richtext") {
      const richtextValue = form.querySelector(`[data-name=richtext-${field.name}] [contenteditable="true"]`).innerHTML;
      serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(richtextValue));
    }

    // Convert field data to a query string
    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
    }
  }

  return serialized.join('&');
};

export default serialize;
