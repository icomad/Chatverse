document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    $notification = $delete.parentNode;
    $notifContainer = $notification.parentNode;
    $delete.addEventListener('click', () => {
      $notifContainer.removeChild($notification);
    });
  });

  const theme = document.getElementById('change-theme')
  if (theme) {
    theme.addEventListener('click', e => {
      const page = document.getElementById('page');
      if (page && page.classList.contains('is-black')) {
        page.classList.remove('is-black');
        page.classList.add('is-white');
        theme.innerText = 'Lights Off';
      }
      else if (page) {
        page.classList.remove('is-white');
        page.classList.add('is-black');
        theme.innerText = 'Lights On';
      }
    })
  }
});