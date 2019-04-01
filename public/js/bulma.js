document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    $notification = $delete.parentNode;
    $notifContainer = $notification.parentNode;
    $delete.addEventListener('click', () => {
      $notifContainer.removeChild($notification);
    });
  });
});