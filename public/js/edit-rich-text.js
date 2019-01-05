import Quill from 'quill';

const editRichText = {
  init() {
    const editorEl = document.querySelector('.js-rich-text-editor-container');
    const quill = new Quill(editorEl, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean'],
        ]
      },
      placeholder: 'Body text here',
      theme: 'snow',
    });
    // editor el is set to display: none in the html.
    // setting to block after it's initialized so we don't
    // get a flash of unstyled content (FOUC)
    editorEl.style.display = 'block';

    // set data-name attr on contenteditable for use when submitting form
    const name = editorEl.getAttribute("data-name");
    editorEl.querySelector("[contenteditable='true']").setAttribute("data-name", name);
  }
};

export default editRichText;
