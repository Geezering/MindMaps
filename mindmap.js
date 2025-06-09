// mindmap.js

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const file = getQueryParam('file');
const mindmapDiv = document.getElementById('mindmap');

if (!file) {
  mindmapDiv.innerHTML = "<p>No mind map specified.</p>";
} else {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.text();
    })
    .then(markdown => {
      const converter = new showdown.Converter();
      let html = converter.makeHtml(markdown);

      // Wrap content after each heading in collapsible-content div
      // This regex matches <h1>, <h2>, <h3> and captures content until next heading or end
      html = html.replace(/(<h([1-3])>.*?<\/h\2>)([\s\S]*?)(?=<h[1-3]>|$)/g, (match, heading, level, content) => {
        content = content.trim();
        if (!content) return heading; // No content to collapse
        return `${heading}<div class="collapsible-content">${content}</div>`;
      });

      mindmapDiv.innerHTML = html;

      // Add click listeners to headings
      const headings = mindmapDiv.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        heading.style.cursor = 'pointer';
        heading.addEventListener('click', () => {
          heading.classList.toggle('is-open');
        });
      });
    })
    .catch(err => {
      mindmapDiv.innerHTML = `<p>Error loading mind map: ${err.message}</p>`;
    });
}
