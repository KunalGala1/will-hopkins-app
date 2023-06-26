import { convertToSlug } from './utils.js';

const forms = document.querySelectorAll('form.crud');

forms.forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Update textarea values with TinyMCE content
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      const editor = tinymce.get(textarea.id);
      if (editor) {
        textarea.value = editor.getContent();
      }
    });

    // Update slugs
    const slug = form.querySelector('input[name="slug"]');
    if (slug) {
      const title = form.querySelector('input[name="title"]');
      slug.value = convertToSlug(title.value);
    }

    const method = form.dataset.method;
    const action = form.dataset.action;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const json = JSON.stringify(formObject);
    const res = await fetch(action, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });
    const data = await res.json();

    if (data.success) {
      switch (data.switch) {
        case 'delete_event':
          document
            .querySelector('[data-id="' + data.deletedEvent._id + '"]')
            .remove();
          break;
        case 'new_event':
          window.location.replace(
            '/dashboard/events/' + data.newEvent._id + '/edit'
          );
        case 'edit_event':
          window.scroll(0, 0);
        default:
          break;
      }
    } else {
      console.log(data.error);
    }
  });
});
