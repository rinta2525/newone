const fs = require('fs');

const jsonPath = "C:\\Users\\rinta\\OneDrive\\デスクトップ\\work\\practice\\saga\\data\\events.json";

if (!fs.existsSync(jsonPath)) {
  console.error("JSONファイルが存在しません:", jsonPath);
  process.exit(1);
}

console.log("JSONファイルを確認できました:", jsonPath);

const fs = require('fs');
const path = require('path');

// 絶対パスで JSON とテンプレート指定
const jsonPath = "C:\\Users\\rinta\\OneDrive\\デスクトップ\\work\\practice\\saga\\data\\events.json";
const templatePath = "C:\\Users\\rinta\\OneDrive\\デスクトップ\\work\\practice\\saga\\template.html";

// 出力先ディレクトリ（events フォルダ）
const outputDir = __dirname;

// JSON 読み込み
const events = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// テンプレート読み込み
const template = fs.readFileSync(templatePath, 'utf-8');

events.forEach(event => {
  // フォルダ名作成（禁止文字は置換）
  const folderName = event.name.replace(/[\\/:*?"<>|]/g, '_');
  const folderPath = path.join(outputDir, folderName);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  // HTML生成
  let html = template;

  // 大会名と日付を置換
  html = html.replace(/<h1>.*<\/h1>/, `<h1>${event.name}</h1>`);
  html = html.replace(/<p class="event-date">.*<\/p>/, `<p class="event-date">開催日：${event.startDate}〜${event.endDate}</p>`);

  // 書類リンク置換・空なら非表示
  const sections = ['要項','申込用紙','タイムテーブル','エントリーリスト','その他','競技結果'];
  sections.forEach(key => {
    const regex = new RegExp(`<div class="event-section"[^>]*data-doc="${key}"[\\s\\S]*?<a href=".*?">`, 'g');
    if (event.documents[key]) {
      html = html.replace(regex, `<div class="event-section" data-doc="${key}"><h2>${key}</h2><a href="${event.documents[key]}">`);
    } else {
      html = html.replace(regex, `<div class="event-section" data-doc="${key}" style="display:none;"><h2>${key}</h2><a href="">`);
    }
  });

  // index.htmlとして保存
  fs.writeFileSync(path.join(folderPath, 'index.html'), html, 'utf-8');
  console.log(`${event.name} のページを作成しました → ${folderPath}/index.html`);
});

console.log('全大会ページの作成が完了しました。');
