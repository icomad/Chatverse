const room = location.pathname;
const socket = io();

const msgArea = document.getElementById('msg-area');
const feedback = document.getElementById('feedback');
const msgTemplate = (msg, color, align, from) => {
  const user = from ? `<sub style="font-size: .6rem">${from}</sub>` : ``;
  return `<p style="color: ${color};text-align:${align}">${msg} ${user}</p>`;
}

const msgForm = document.getElementById('msg-form');
const msgInput = document.getElementById('message');
let typingTimeout;

const onTypingEnd = () => {
  socket.emit("typing", false);
}

socket.on('connect', () => {
  socket.emit('joinRoom', room);
});

socket.on('userJoined', () => {
  vNotify.minimalSuccess({
    text: 'A new user joined this room',
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    fadeInterval: 50,
    visibleDuration: 1000,
    postHoverVisibleDuration: 500,
    position: 'bottomRight',
    sticky: false,
    showClose: false
  });
});

socket.on('userLeft', () => {
  vNotify.minimalDanger({
    text: 'A user left this room',
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    fadeInterval: 50,
    visibleDuration: 1000,
    postHoverVisibleDuration: 500,
    position: 'bottomRight',
    sticky: false,
    showClose: false
  });
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
    from: '-handle-',
  };

  console.log(msg);
  socket.emit('sentMsg', msg);
  msgArea.innerHTML += msgTemplate(msgInput.value, 'black', 'right', null);
  msgArea.scrollTop = msgArea.scrollHeight;
  msgInput.value = '';
});

socket.on('typing', (isTyping) => {
  feedback.innerHTML = isTyping ? msgTemplate('<em>Someone is typing...</em>', 'rgba(0,0,0,.2)', 'center') : '';
});

socket.on('incomingMsg', msg => {
  feedback.innerHTML = '';
  const color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
  msgArea.innerHTML += msgTemplate(msg.text, color, 'left', msg.from);
  msgArea.scrollTop = msgArea.scrollHeight;
});

