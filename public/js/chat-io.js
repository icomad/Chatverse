const room = location.pathname;
const socket = io();

const msgArea = document.getElementById('msg-area');
const feedback = document.getElementById('feedback');
const msgTemplate = (msg, color, align, from) => {
  const p = document.createElement('p');
  const sub = document.createElement('sub');
  p.textContent = msg + ' ';
  p.style.textAlign = align;
  p.style.color = color;
  sub.textContent = from;
  sub.style.fontSize = '.6rem';
  p.appendChild(sub);
  msgArea.appendChild(p);
  msgArea.scrollTop = msgArea.scrollHeight;
}

const msgFormContainer = document.getElementById('msg-form-cont');
const msgForm = document.getElementById('msg-form');
const msgInput = document.getElementById('message');
const handleFormContainer = document.getElementById('handle-form-cont');
const handleForm = document.getElementById('handle-form');
const handle = document.getElementById('handle');
let typingTimeout;

const usersCountSpan = document.getElementById('users-count');

const convoDl = document.getElementById('convo-dl');

let colors = {};
let username;
let convo = [];

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
  if (colors.hasOwnProperty(handle.value)) {
    handle.value = '';
    handle.setAttribute('placeholder', 'Username already in use! - Click me');
    return handle.blur();
  }
  if (handle.value.length > 16) {
    handle.value = '';
    handle.setAttribute('placeholder', 'Username must be less than 12 characters! - Click me');
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
  if (msg.text === '' || msg.text.trim() === '') return;
  socket.emit('sentMsg', msg);
  convo.push(msg);
  msgTemplate(msgInput.value, 'inherit', 'right', null);
  msgInput.value = '';
});

socket.on('typing', (isTyping) => {
  const color = document.getElementById('page').classList.contains('is-black') ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)';
  const p = document.createElement('p');
  const em = document.createElement('em');
  const small = document.createElement('small');
  p.style.color = color;
  p.style.textAlign = 'center';
  small.textContent = 'Someone is typing...';
  p.appendChild(em);
  em.appendChild(small);
  feedback.innerHTML = '';
  if (isTyping) {
    feedback.appendChild(p);
  }
});

socket.on('incomingMsg', msg => {
  convo.push(msg);
  feedback.innerHTML = '';
  const hsl = `hsl(${Math.floor(Math.random() * 400)}, 100%, 45%)`
  if (!colors.hasOwnProperty(msg.from)) colors[msg.from] = hsl;
  msgTemplate(msg.text, colors[msg.from], 'left', msg.from);
});

convoDl.addEventListener('click', e => {
  const convoToDl = convo.map((msg, index) => {
    msg.index = index;
    return msg;
  });
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(convoToDl));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'convo.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});