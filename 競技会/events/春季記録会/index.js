document.addEventListener('DOMContentLoaded', () => {
  const pageTitle = document.querySelector('.page-header h1').textContent.trim();

  fetch('/data/events.json')
    .then(res => res.json())
    .then(data => {
      // ページの大会名と一致する大会データを取得
      const eventData = data.find(e => e.name === pageTitle);
      if (!eventData) return;

      const sections = document.querySelectorAll('.event-section');
      sections.forEach(section => {
        const docKey = section.dataset.doc; // data-doc属性をキーに
        const link = section.querySelector('a');

        if (eventData.documents[docKey]) {
          // JSONにリンクがあれば href を反映して表示
          link.href = eventData.documents[docKey];
          link.style.display = ''; // 表示
        } else {
          // 空欄なら非表示
          link.style.display = 'none';
        }
      });
    })
    .catch(err => console.error('JSON読み込みエラー:', err));
});