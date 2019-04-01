const room = location.pathname;
const socket = io();

const msgArea = document.getElementById('msg-area');
const feedback = document.getElementById('feedback');
const msgTemplate = (msg, color, align, from) => {
  const user = from ? `<sub style="font-size: .6rem">${from}</sub>` : ``;
  return `<p style="color: ${color};text-align:${align}">${msg} ${user}</p>`;
}

const msgFormContainer = document.getElementById('msg-form-cont');
const msgForm = document.getElementById('msg-form');
const msgInput = document.getElementById('message');
const handleFormContainer = document.getElementById('handle-form-cont');
const handleForm = document.getElementById('handle-form');
const handle = document.getElementById('handle');
let typingTimeout;

const usersCountSpan = document.getElementById('users-count');

let colors = {};
let username;

const onTypingEnd = () => {
  socket.emit("typing", false);
}

socket.on('connect', () => {
  socket.emit('joinRoom', room);
});

socket.on('usersCount', usersCount => {
  usersCountSpan.innerText = usersCount;
})

socket.on('userJoined', (usersCount) => {
  usersCountSpan.innerText = usersCount;
  vNotify.minimalSuccess({
    text: 'A new user joined this room',
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    fadeInterval: 50,
    visibleDuration: 2000,
    postHoverVisibleDuration: 500,
    position: 'bottomCenter',
    sticky: false,
    showClose: false
  });
});

socket.on('userLeft', (usersCount) => {
  usersCountSpan.innerText = usersCount;
  vNotify.minimalDanger({
    text: 'A user left this room',
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    fadeInterval: 50,
    visibleDuration: 2000,
    postHoverVisibleDuration: 500,
    position: 'bottomCenter',
    sticky: false,
    showClose: false
  });
});

handleForm.addEventListener('submit', e => {
  e.preventDefault();
  handle.setAttribute('placeholder', 'Enter Username');
  if (handle.value.trim() === '') {
    handle.value = '';
    handle.setAttribute('placeholder', 'You must enter a username - Click me');
    return handle.blur();
  }
  if (/[^A-Za-z0-9]+/g.test(handle.value)) {
    handle.value = '';
    handle.setAttribute('placeholder', 'Invalid character, use only (A-Za-z0-9) - Click me');
    return handle.blur();
  }
  handle.blur();
  handleFormContainer.classList.add('handle-form-cont-hide');
  let showTimeout = setTimeout(() => {
    handleFormContainer.style.display = 'none';
    msgFormContainer.classList.add('msg-form-cont-show');
    clearTimeout(showTimeout);
  }, 400);
});


msgInput.addEventListener('keyup', (e) => {
  if (e.key == 'Enter') return;
  socket.emit('typing', true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(onTypingEnd, 4000);
});

msgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = {
    text: msgInput.value,
    from: handle.value,
  };

  socket.emit('sentMsg', msg);
  msgArea.innerHTML += msgTemplate(msgInput.value, 'black', 'right', null);
  msgArea.scrollTop = msgArea.scrollHeight;
  msgInput.value = '';
});

socket.on('typing', (isTyping) => {
  feedback.innerHTML = isTyping ? msgTemplate('<em><small>Someone is typing...</small></em>', 'rgba(0,0,0,.2)', 'center') : '';
});

socket.on('incomingMsg', msg => {
  feedback.innerHTML = '';
  const color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
  if (!colors.hasOwnProperty(msg.from)) colors[msg.from] = color;
  msgArea.innerHTML += msgTemplate(msg.text, colors[msg.from], 'left', msg.from);
  msgArea.scrollTop = msgArea.scrollHeight;
});

