// convert time to 12hr format
export const convertTime = (time) => {
  let hours = time.split(":")[0];
  let minutes = time.split(":")[1];
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const convertToSlug = (inputString) => {
  return inputString
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace whitespace with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters and hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
};

export const toastNotification = (message, type, duration = 1000) => {
  const toastNotification = document.createElement("div");
  toastNotification.classList.add("toast-notification", "active", type);
  toastNotification.textContent = message;
  document.body.appendChild(toastNotification);
  setTimeout(() => {
    toastNotification.classList.remove("active");
    setTimeout(() => {
      toastNotification.remove();
    }, 250);
  }, duration);
};

export function getYouTubeVideoId(url) {
  // Extract the video ID from the URL using a regular expression
  const regex = /[?&]v=([^&#]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    // Return the extracted video ID
    return match[1];
  } else {
    // Return null if the URL is invalid or the video ID is not found
    return null;
  }
}
