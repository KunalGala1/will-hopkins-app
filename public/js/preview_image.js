document.addEventListener('DOMContentLoaded', function () {
  const fileInputs = document.querySelectorAll('input[type=file]');

  const preview_other = fileInput => {
    const preview = fileInput.parentNode.querySelector('.filename');
    if (preview === null) {
      return;
    }

    if (preview.querySelector('span').innerHTML !== '') {
      preview.classList.add('active');
    }

    fileInput.addEventListener('change', ev => {
      const files = ev.target.files;

      if (files.length === 0) {
        return;
      }

      const span = fileInput.parentNode.querySelector('.filename span');

      span.innerHTML = files[0].name;
    });
  };

  if (fileInputs.length === 0) {
    return;
  }

  fileInputs.forEach(fileInput => {
    const preview = fileInput.parentNode.querySelector('.preview');
    if (preview === null) {
      preview_other(fileInput);
      return;
    }
    if (preview.querySelector('img').getAttribute('src') !== '') {
      preview.classList.add('active');
    }

    fileInput.addEventListener('change', ev => {
      const files = ev.target.files;

      if (files.length === 0) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result;

        // Check if img src is not empty then add 'active' class
        if (img.src !== '') {
          preview.classList.add('active');
        }

        preview.innerHTML = '';

        // Create and append img element
        preview.appendChild(img);

        // Create and append input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'mg-t-sm';
        input.name = `${preview.parentNode.querySelector('input').name}-alt`;
        input.placeholder = 'Image description...';
        // input.setAttribute("novalidate");
        preview.appendChild(input);
      };

      reader.readAsDataURL(files[0]);
    });
  });
});
