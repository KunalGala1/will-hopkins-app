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
    const action = form.action;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    // File upload
    const uploadFile = async fileInput => {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/upload', {
        method: 'post',
        body: formData,
      });
      const data = await res.json();
      console.log(data);

      formObject.file = data.file;
    };

    const persistFile = async () => {
      const res = await fetch('/dashboard/events/' + form.dataset.id, {
        method: 'get',
      });
      const data = await res.json();
      console.log(data);

      formObject.file = JSON.parse(data.event.json).file;
    };

    const fileInputs = form.querySelectorAll('input[type="file"]');
    const promises = [];

    for (const fileInput of fileInputs) {
      if (method == 'post') {
        // upload file
        if (fileInput.files.length > 0) {
          promises.push(uploadFile(fileInput));
        } else {
          alert('Please upload a file');
          return;
        }
      } else if (method == 'put') {
        if (fileInput.files.length > 0) {
          promises.push(uploadFile(fileInput));
        } else {
          // No changes were made to the file
          promises.push(persistFile());
        }
      }
    }

    Promise.all(promises)
      .then(async () => {
        const json = JSON.stringify(formObject);

        const res = await fetch(action, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: json,
        });
        const data = await res.json();
        console.log(data);

        /* ====================================================== */

        /* Responses */

        switch (data.reaction) {
          case 'deletedEvent':
            document
              .querySelector('[data-id="' + data.deletedEvent._id + '"]')
              .remove();
            break;

          case 'newEvent':
            window.location.replace(
              '/dashboard/events/' + data.newEvent._id + '/edit'
            );
            break;

          case 'updatedEvent':
            break;

          default:
            break;
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
});
