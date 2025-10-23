document.addEventListener('DOMContentLoaded', () => {
  // タブ切り替え
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
  // タブ切り替え
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  // JSONから大会カードを生成
  fetch('/data/events.json')
    .then(res => res.json())
    .then(data => {
      const today = new Date();

      const upcomingList = document.querySelector('#upcoming .event-list');
      const pastList = document.querySelector('#past .event-list');
      const allList = document.querySelector('#all .event-list');

      // すべての大会カードを入れる <ul> がまだなければ作成
      if (!allList) {
        const ul = document.createElement('ul');
        ul.className = 'event-list';
        document.getElementById('all').appendChild(ul);
      }

      data.forEach(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        const dateText = (start.getTime() === end.getTime()) 
          ? `開催日：${event.startDate}` 
          : `開催日：${event.startDate}〜${event.endDate}`;

        // カード生成
        const li = document.createElement('li');
        li.className = 'event-item';
        li.innerHTML = `
          <span class="name">${event.name}</span>
          <span class="date">${dateText}</span>
        `;

        // カード全体クリックでリンクへ
        li.addEventListener('click', () => {
          window.location.href = event.link;
        });

        // これからの大会 or 終わった大会振り分け
        if (today <= end) {
          if (upcomingList) upcomingList.appendChild(li.cloneNode(true));
        } else {
          if (pastList) pastList.appendChild(li.cloneNode(true));
        }

        // すべての大会に追加
        document.querySelector('#all .event-list').appendChild(li);
      });
    });
});
