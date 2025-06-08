// mindmap.js

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const file = getQueryParam('file');
if (file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then(markdown => {
      const converter = new showdown.Converter();
      const html = converter.makeHtml(markdown);
      document.getElementById('mindmap').innerHTML = html;
      makeInteractive();
    })
    .catch(err => {
      document.getElementById('mindmap').innerHTML = `<p>Error loading mind map: ${err.message}</p>`;
    });
} else {
  document.getElementById('mindmap').innerHTML = "<p>No mind map specified.</p>";
}

// The same makeInteractive function as before
function makeInteractive() {
  const nodes = document.querySelectorAll('#mindmap ul');
  nodes.forEach(ul => {
    const parent = ul.previousElementSibling;
    if (parent && parent.tagName.match(/^H[2-6]$/)) {
      ul.style.display = 'none';
      parent.style.cursor = 'pointer';
      parent.addEventListener('click', () => {
        ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
      });
    }
  });
}
