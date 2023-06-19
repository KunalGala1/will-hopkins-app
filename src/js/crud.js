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

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const json = JSON.stringify(formObject);
    const res = await fetch('/dashboard/' + form.name + '/' + form.dataset.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });

    const data = await res.json();
    console.log(data);
  });
});
