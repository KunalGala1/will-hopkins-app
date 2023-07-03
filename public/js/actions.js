export const responseAction = (name, method, data) => {
  const actions = {
    event: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newEvent._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-event-id="${data.deletedEvent._id}"]`).remove();
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }
};
