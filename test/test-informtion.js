// information/information.js
// 年ごとにお知らせを自動分類して表示する

fetch('/test/test.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('news-container');
    container.innerHTML = ''; // 初期メッセージ削除

    // 日付順（新しい順）にソート
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 年ごとにグループ化
    const grouped = {};
    data.forEach(item => {
      const year = new Date(item.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });

    // 年の降順で表示（最新年度が上）
    Object.keys(grouped)
      .sort((a, b) => b - a)
      .forEach(year => {
        const yearBlock = document.createElement('div');
        yearBlock.className = 'news-year-block';
        yearBlock.innerHTML = `<h2 class="news-year">${year}年度</h2><ul class="news-list"></ul>`;

        const list = yearBlock.querySelector('.news-list');

        grouped[year].forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="date">${item.date.replace(/-/g, '/')}</span>
            <span class="label">${item.category || 'お知らせ'}</span>
            <span class="text"><a href="${item.url || '#'}">${item.title}</a></span>
          `;
          list.appendChild(li);
        });

        container.appendChild(yearBlock);
      });
  })
  .catch(err => {
    document.getElementById('news-container').innerHTML =
      '<p style="color:red;">お知らせの読み込みに失敗しました。</p>';
    console.error('news.json読み込みエラー:', err);
  })