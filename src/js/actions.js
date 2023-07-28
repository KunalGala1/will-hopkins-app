export const responseAction = (name, method, data) => {
  const actions = {
    events: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
    },
    works: {
      post: () => {
        window.location.replace(`/dashboard/works/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }
};
