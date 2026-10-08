# スマートフォンで使うための公開手順

公開するアプリ：このリポジトリの「デリログ」。公開先は通常 https://miyahiro-afk.github.io/delivery-income-app/ です。公開完了までは、このURLが使えるとは限りません。

## 1. Private リポジトリの条件を確認

GitHub Free では Private リポジトリの GitHub Pages は利用できません。個人アカウントでは GitHub Pro などの対応プランが必要です。対応プランなら Private のまま次に進めます。

無料で公開するにはリポジトリを Public にする必要があります。ただしコードが誰でも閲覧できるようになります。Private のままにしたい場合は変更せず、対応プランを利用してください。

リポジトリが Private でも、通常の GitHub Pages で公開したアプリのURLは誰でも開けます。売上などの入力データは使った端末・ブラウザー内に保存され、GitHubへ送信されません。コードに個人の記録や秘密の情報を入れないでください。

## 2. 公開方法を選ぶ

1. GitHub にログインし、https://github.com/miyahiro-afk/delivery-income-app を開きます。
2. 上部の「Settings」（設定）を押します。
3. 左側の「Pages」を押します。
4. 「Build and deployment」の「Source」を「GitHub Actions」にします。
5. Pages が有料プランへの変更を案内する場合は、先に手順1の条件を整えてください。

## 3. 公開処理を実行

1. リポジトリ上部の「Actions」を開きます。
2. 左側の「Publish app to GitHub Pages」を選びます。
3. 「Run workflow」を押し、ブランチが「main」になっていることを確認して実行します。
4. 一覧に新しい処理が表示されたら開きます。「build」「deploy」がどちらも緑のチェックになるまで待ちます。
5. 初回に承認待ちになった場合は「Review deployments」を押し、「github-pages」を選んで承認します。
6. 失敗した場合は赤い項目を開き、表示されるエラーを確認します。Pages の Source と利用プランを確認してください。

今後は main にコードが追加されるたび、自動で更新します。

## 4. スマートフォンで開く

1. 「Settings」→「Pages」に表示される公開URL（「Visit site」）を確認します。これが実際のURLです。
2. スマートフォンでそのURLを開きます。通常は https://miyahiro-afk.github.io/delivery-income-app/ です。
3. iPhone は Safari の共有ボタンから「ホーム画面に追加」、Android は Chrome のメニューから「ホーム画面に追加」を選びます。
4. ホーム画面の「デリログ」アイコンから起動します。

開発環境で入力した記録は、新しい公開URLや別端末へ自動で移りません。今後使う公開URLで記録してください。ブラウザーのデータを消すと記録も消えます。

## コードが main に反映されていない場合

「Code」を開き、main に package.json、src、public、vite.config.js、.github/workflows/deploy-pages.yml があることを確認してください。ファイルがない場合は、まだコードの反映が必要です。「Upload files」だけで隠しフォルダーが漏れると自動公開できないため、開発環境から Git で一括反映する必要があります。
