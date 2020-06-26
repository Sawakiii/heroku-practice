// バックエンド(サーバとデータベース)のフレームワークexpressをインポート
const express = require('express')
// mongoDBと接続するためのmongooseをインポート
const mongoose = require('mongoose')


// サーバサイドアプリの作成
const app = express()

// ミドルウェアの設定
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ポート番号の設定
const port = 3001


// データの型を定義する。
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
})
// モデルの定義。データの検索などのメソッドがまとまったクラス
const User = mongoose.model("User", UserSchema)

// DBの接続用url。mongodb://localhost/userDb
const url = "mongodb://localhost/userDb"

// データベースへ接続する
mongoose.connect(url, err=>{
    if (err) console.error(err)
    console.log("DBへ接続完了")
    // 接続中の処理が以下に入る。
})

// app.HTTPメソッド(url, コールバック関数)でリクエストを受け取る処理が書ける。
app.get("/api/users", (req, res)=>{
    console.log("GETのリクエストが来ました。")
    User.find({}, (err, userArray)=>{
        if (err) console.error(err)
        res.json({
            msg: "GETに対するレスポンスです",
            data: userArray
        })
    })
})

app.post("/api/users", (req, res)=>{
    console.log(req.body)

    new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    }).save(err=>{
        if (err) console.error(err)
        res.json({
            msg: req.body.name + "のデータを保存しました。"
        })
    })

})

// app.delete("/api/user", (req, res)=>{
//     User.findByIdAndRemove(req.body._id, (err)=>{
//         if (err) res.send(err)
//         User.find({}, (err, userArray)=>{
//             if (err) res.send(err)
//             res.json({users: userArray})
//         })
//     })
// })


// deleteが来た場合の処理を書く。
app.delete('/api/users', (req, res)=>{
    // 削除するデータを見つける。(クライアント側から送られるidを使う)
    // ユーザのデータを削除する。
    // 上記2つを同時に行えるfindByIdAndRemove()のメソッドを使う。
    User.findByIdAndRemove(req.body.id, (err)=>{
        if (err) res.send(err)
        // 削除されたものを反映するためにもう一度getと同じ処理(find)を使う。
        User.find({}, (err, userArray)=>{
            if (err) res.send(err)
            res.json({
                data: userArray
            })
        })
    })
})






// アプリの起動
app.listen(port, err=>{
    if (err) console.error(err)
    console.log(`listening on port ${port}`)
})





