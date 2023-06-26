import { convertTime } from '../js/utils.js';
import { formatDate } from '../js/utils.js';
import { convertToSlug } from '../js/utils.js';

document.querySelectorAll('#events[data-cli] .card').forEach(card => {
  // Convert time to 12 hour format
  card.querySelector('span.time').innerText = convertTime(
    card.querySelector('span.time').innerText
  );

  // Format date
  card.querySelector('span.date').innerText = formatDate(
    card.querySelector('span.date').innerText
  );
});
