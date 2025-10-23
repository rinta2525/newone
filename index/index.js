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
  const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';
  fetch(`${pathPrefix}data/events.json`)

    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const scheduleContainer = document.getElementById('home-schedule');
      const resultsContainer = document.getElementById('home-results');

      let upcomingCount = 0;
      let finishedCount = 0;

      // 🔹 UTCずれを防ぐため "YYYY-MM-DD" をローカル日付で変換
      function toLocalDate(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      }

      // 🔹 カード生成関数
      function createCard(event, isResult = false) {
        const start = toLocalDate(event.startDate);
        const end = toLocalDate(event.endDate);

        const dateText = (start.getTime() === end.getTime()) 
          ? `開催日：${event.startDate}` 
          : `開催日：${event.startDate}〜${event.endDate}`;

        const card = document.createElement('div');
        card.className = isResult ? 'post-item-b' : 'post-item';
        card.innerHTML = `
          <div class="post-date">${dateText}</div>
          <div class="post-title">${event.name}</div>
          <p>${event.description}</p>
        `;

        card.addEventListener('click', () => {
          window.location.href = event.link;
        });

        return card;
      }

      // 🔹 イベントを分類
      const upcomingEvents = [];
      const finishedEvents = [];

      data.forEach(event => {
        const endDate = toLocalDate(event.endDate);

        if (endDate >= todayDate) {
          // 今日以降に終了 → 「これからの大会」
          upcomingEvents.push(event);
        } else {
          // 昨日以前に終了 → 「終了した大会」
          finishedEvents.push(event);
        }
      });

      // 🔹 並び替え
      upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // 近い順（昇順）
      finishedEvents.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)); // 近い順（降順）

      // 🔹 表示
      upcomingEvents.slice(0, 10).forEach(event => {
        scheduleContainer.appendChild(createCard(event, false));
      });

      finishedEvents.slice(0, 6).forEach(event => {
        resultsContainer.appendChild(createCard(event, true));
      });
    });
});



