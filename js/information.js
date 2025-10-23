document.addEventListener('DOMContentLoaded', async () => {
  const infoContainer = document.querySelector('.information ul');
  if (!infoContainer) return;

  try {
    const res = await fetch('/data/information.json');
    const data = await res.json();

    // 日付で降順ソート
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // index.htmlかinformation.htmlか判定
    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const displayData = isHome ? data.slice(0, 7) : data;

    if (isHome) {
      // ホーム → 最新3件のみ表示
      infoContainer.innerHTML = displayData.map(item => `
        <li>
          <span class="date">${item.date}</span>
          <span class="${item.labelClass}">${item.label}</span>
          <span class="text"><a href="${item.link}">${item.text}</a></span>
        </li>
      `).join('');
    } else {
      // information.html → 年ごとに分類して表示
      const grouped = {};
      displayData.forEach(item => {
        const year = item.date.slice(0, 4);
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(item);
      });

      infoContainer.innerHTML = Object.keys(grouped)
        .sort((a, b) => b - a)
        .map(year => `
          <h2 style="margin-top:30px;">${year}年</h2>
          ${grouped[year].map(item => `
            <li>
              <span class="date">${item.date}</span>
              <span class="${item.labelClass}">${item.label}</span>
              <span class="text"><a href="${item.link}">${item.text}</a></span>
            </li>
          `).join('')}
        `).join('');
    }

  } catch (err) {
    console.error('お知らせの読み込みに失敗しました:', err);
    infoContainer.innerHTML = '<li>お知らせを読み込めませんでした。</li>';
  }
});
