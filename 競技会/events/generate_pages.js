const fs = require('fs');
const path = require('path');

// JSONファイルのパス
const jsonPath = "C:\\Users\\rinta\\OneDrive\\デスクトップ\\work\\practice\\saga\\data\\events.json";
const templatePath = "C:\\Users\\rinta\\OneDrive\\デスクトップ\\work\\practice\\saga\\template.html";

const outputDir = __dirname;

// JSON読み込み
const events = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// テンプレート読み込み
const template = fs.readFileSync(templatePath, 'utf-8');

// 各大会ごとにHTMLを生成
events.forEach(event => {
  // 改行・タブ・禁止文字を安全な形に置換
  const folderName = event.name
    .replace(/\r?\n/g, ' ')      // 改行をスペースに
    .replace(/\t/g, ' ')         // タブをスペースに
    .replace(/[\\/:*?"<>|]/g, '_') // 禁止文字をアンダースコアに
    .trim();                     // 先頭・末尾の空白を削除

  const folderPath = path.join(outputDir, folderName);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  // テンプレートの大会名・日付・リンク・書類を置換
  let html = template;
  html = html.replace(/<h1>.*<\/h1>/, `<h1>${event.name}</h1>`);

  // 日付の置換
  html = html.replace(/<p class="event-date">.*<\/p>/, `<p class="event-date">開催日：${event.startDate}〜${event.endDate}</p>`);

  // 書類リンクの置換（簡易版）
  html = html.replace(/<div class="event-section" data-doc="要項">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="要項"><h2>大会要項</h2><a href="${event.documents['要項'] || ''}">`);
  html = html.replace(/<div class="event-section" data-doc="申込用紙">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="申込用紙"><h2>申込用紙</h2><a href="${event.documents['申込用紙'] || ''}">`);
  html = html.replace(/<div class="event-section" data-doc="タイムテーブル">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="タイムテーブル"><h2>タイムテーブル</h2><a href="${event.documents['タイムテーブル'] || ''}">`);
  html = html.replace(/<div class="event-section" data-doc="エントリーリスト">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="エントリーリスト"><h2>エントリーリスト</h2><a href="${event.documents['エントリーリスト'] || ''}">`);
  html = html.replace(/<div class="event-section" data-doc="その他">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="その他"><h2>その他</h2><a href="${event.documents['その他'] || ''}">`);
  html = html.replace(/<div class="event-section" data-doc="競技結果">[\s\S]*?<a href=".*?">/g, 
    `<div class="event-section" data-doc="競技結果"><h2>競技結果</h2><a href="${event.documents['競技結果'] || ''}">`);

  // index.html として書き出し
  fs.writeFileSync(path.join(folderPath, 'index.html'), html, 'utf-8');

  console.log(`${event.name} のページを作成しました → ${folderPath}\\index.html`);
});

console.log('全大会ページの作成が完了しました。');
