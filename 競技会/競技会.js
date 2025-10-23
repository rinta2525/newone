  document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // --- タブ切り替え ---
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

  // --- JSONから大会カード生成 ---
  fetch('./data/events.json')
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 日付のみ比較

      const upcomingList = document.querySelector('#upcoming .event-list');
      const pastList = document.querySelector('#past .event-list');
      const allList = document.querySelector('#all .event-list');

      // 🔹 UTCずれを防ぐため "YYYY-MM-DD" をローカル日付に変換
      function toLocalDate(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      }

      // 🔹 イベントを分類
      const upcomingEvents = [];
      const pastEvents = [];

      data.forEach(event => {
        const end = toLocalDate(event.endDate);

        if (end >= todayDate) {
          // 今日以降に終了する大会 → これからの大会
          upcomingEvents.push(event);
        } else {
          // 昨日以前に終了した大会 → 終了した大会
          pastEvents.push(event);
        }
      });

      // 🔹 並び順を指定
      upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // 開催日が近い順（昇順）
      pastEvents.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)); // 終了日が近い順（降順）

      // 🔹 カードを生成して追加する関数
      function createEventCard(event) {
        const start = toLocalDate(event.startDate);
        const end = toLocalDate(event.endDate);

        const dateText = (start.getTime() === end.getTime())
          ? `開催日：${event.startDate}`
          : `開催日：${event.startDate}〜${event.endDate}`;

        const li = document.createElement('li');
        li.className = 'event-item';
        li.innerHTML = `
          <span class="date">${dateText}</span>
          <span class="name">${event.name}</span>
        `;
        li.addEventListener('click', () => {
          window.location.href = event.link;
        });
        return li;
      }

      // 🔹 これからの大会を追加
      if (upcomingList) {
        upcomingEvents.forEach(event => {
          upcomingList.appendChild(createEventCard(event));
        });
      }

      // 🔹 終了した大会を追加
      if (pastList) {
        pastEvents.forEach(event => {
          pastList.appendChild(createEventCard(event));
        });
      }

      // 🔹 全大会を「終了日が新しい順」で表示
      if (allList) {
        const allEvents = [...upcomingEvents, ...pastEvents];
        allEvents.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        allEvents.forEach(event => {
          allList.appendChild(createEventCard(event));
        });
      }
    })
    .catch(err => console.error('JSON読み込みエラー:', err));
});

