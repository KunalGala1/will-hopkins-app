console.log('test');

const urlInput = document.querySelector('input[type=url]');
console.log(urlInput);

urlInput.addEventListener('input', ev => {
  console.log(ev);
});
