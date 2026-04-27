# AGENTS.md

## このリポジトリについて
これは、**会社のレクリエーション用ブラウザクイズアプリ**のリポジトリです。  
参加者はスマホ等のブラウザから回答し、全体表示画面に回答状況をリアルタイム反映します。

## まず最初に読むべき設計ファイル
このリポジトリ直下または参照可能な場所に以下のファイルがある場合、**必ず最初に読んでから作業**してください。

- `quiz_app_table_definitions.txt`
- `quiz_app_class_responsibilities.txt`
- `quiz_app_class_dependency_list.txt`

これらを、このプロジェクトの設計上の正本として扱ってください。  
コード変更時は、これらの内容に反しないようにしてください。

---

## 目的
このプロジェクトの目的は以下です。

- 会社レクリエーション用のクイズアプリを作る
- ブラウザで動作させる
- 参加者は約20人
- 参加者画面、全体画面、進行者画面を用意する
- 参加者の回答を全体画面にリアルタイム反映する

---

## 現在の主要要件
- 参加者は **名前 + 参加用共通パスワード** で参加する
- 進行者は **管理用パスワード** でログインする
- Cognito による個人アカウント作成は行わない
- `questionIndex = 0` は待機画面
- 問題開始前は待機画面を表示する
- 回答は **1人1票**
- **回答変更不可**
- **名前あり**
- **票数は回答中に表示**
- **正解発表は締切後**
- **正解表示時に採点する**
- 問題ごとに配点がある
- ランキングは `totalScore` 降順
- 同点は同順位

---

## 技術前提
- React
- Vite
- TypeScript
- react-router-dom
- AWS を前提にした設計
- 問題データは S3 上の JSON
- 状態・回答・集計・ランキング・セッションは DynamoDB
- リアルタイム通知は AppSync Events
- サーバー処理は Lambda

ただし、初期実装では **フロント骨組みの作成を優先**し、AWS 実接続は後回しでもよいです。

---

## 画面一覧
以下の画面を持ちます。

### `/join`
参加者ログイン画面
- 名前入力
- 参加用パスワード入力
- 成功後、待機画面へ遷移

### `/player`
参加者画面
- 問題文
- 選択肢 A〜D
- 回答済み表示
- 回答後は再回答不可

### `/screen`
全体表示画面
- 問題文
- 選択肢 A〜D
- 各選択肢の票数
- 正解表示エリア
- ランキング表示エリア

### `/host`
進行者画面
- 問題番号ボタン
- 正解表示ボタン

---

## 状態遷移
`rooms.status` は以下の3状態のみを扱います。

- `waiting`
- `open`
- `result`

意味:
- `waiting`: 待機中
- `open`: 回答受付中
- `result`: 締切済み・正解表示中

---

## データモデルの前提
テーブル構成は以下です。

- `rooms`
- `participants`
- `answers`
- `tallies`
- `participantScores`
- `sessions`

詳細は必ず `quiz_app_table_definitions.txt` を参照してください。

---

## フロントエンド設計方針
### UI
- UI は **React の関数コンポーネント** で実装する
- hooks を用いて画面ロジックを分離する
- presentation 層に業務ロジックを書きすぎない

### ロジック
- ロジックは **オブジェクト指向で整理**する
- UseCase, Entity, ValueObject, DomainService, Repository Interface を分ける
- 最終的な業務ルールの正本はバックエンドにある前提で、フロントは画面制御・整流・依存隠蔽を主目的とする

---

## アーキテクチャルール
依存方向は必ず以下に従ってください。

- `presentation` -> `application`
- `application` -> `domain`
- `infrastructure` が `domain/repositories` を実装する

### 禁止事項
- presentation 層から repository を直接呼ばない
- presentation 層から entity を直接 `new` しない
- page コンポーネントに業務ルールの if 文を散らさない
- UseCase に UI state を持たせない
- mapper に変換以外の責務を持たせない

---

## ディレクトリ構成
以下の構成を前提とします。

```text
src/
  app/
    router/
    layouts/
    config/
  presentation/
    pages/
      join/
      player/
      screen/
      host/
      not-found/
    components/
      common/
    hooks/
  application/
    usecases/
    dto/
  domain/
    entities/
    valueObjects/
    services/
    repositories/
  infrastructure/
    api/
    repositories/
    realtime/
    storage/
    mappers/
  shared/
    types/
    utils/
    errors/
```

---

## 命名規則
- UseCase: `XxxUseCase.ts`
- Entity: `Xxx.ts`
- ValueObject: `Xxx.ts`
- Repository Interface: `I...Repository.ts`
- Repository 実装: `XxxRepository.ts`
- Mapper: `XxxMapper.ts`
- React ページ: `XxxPage.tsx`
- React コンポーネント: `Xxx.tsx`

---

## まず実装すべきもの
実装の優先順位は以下です。

1. ルーティング
2. 各ページの最小表示
3. 共通レイアウト
4. `LocalStorageService`
5. `SessionStorageGateway`
6. `ApiClient`
7. `endpoints`
8. 最小の domain クラス
   - `Room`
   - `Question`
   - `Session`
   - `RoomStatus`
   - `QuestionIndex`
   - `Choice`
9. モックデータでの画面表示
10. その後に UseCase / Repository 骨組み

---

## 初期実装の方針
初期段階では以下を優先してください。

- **まずは動く骨組み**
- **まずはモックデータで表示**
- AWS 実接続は後回しでもよい
- 未実装部分は `TODO:` コメントで明示する
- コンパイルエラーを出さないことを優先する

---

## セッション方針
- セッションは `sessions` テーブルで管理する前提
- 参加者セッション有効時間は 12 時間
- 進行者セッション有効時間は 8 時間
- 同じ端末・同じブラウザでの自動復帰のみ対応
- 端末変更・ブラウザ変更時の復帰は MVP では実装しない

フロントでは以下を `localStorage` に保存する前提です。

### 参加者
- `roomId`
- `participantId`
- `participantName`
- `role`
- `sessionToken`
- `sessionExpiresAt`

### 進行者
- `roomId`
- `role`
- `sessionToken`
- `sessionExpiresAt`

---

## 実装時の品質ルール
- TypeScript の型をできるだけ明示する
- `any` は極力使わない
- 一時対応でも雑に global 化しない
- import path を破綻させない
- 未使用コードを増やしすぎない
- 過剰な抽象化を避ける
- ただし後で拡張しやすい構造にする

---

## スタイリング方針
- 初期段階ではシンプルでよい
- CSS フレームワークは無理に追加しない
- 画面ごとの役割が分かる最低限の見た目を優先する
- 将来的な差し替えや改善を邪魔しない構造にする

---

## 作業時の出力ルール
コード変更を行う場合は、可能なら以下を明示してください。

1. 作成・更新したファイル一覧
2. 変更内容の要約
3. まだ未実装の TODO
4. 次に着手すべき項目

---

## このプロジェクトで大事なこと
- まずは **最小構成で動かす**
- React の UI 設計とロジック層の責務分離を崩さない
- 画面に業務ルールを書き込みすぎない
- 設計資料を無視して独自判断で構造を変えない
- 迷ったら、**シンプルで読みやすく、後から拡張しやすい案** を選ぶ
