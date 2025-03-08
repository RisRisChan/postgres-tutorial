const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 8000;

app.use(express.json());

// app.get("/test", (req, res) => {
//   res.send("Hello Express");
// });

//ユーザー情報をすべて取得する
app.get("/users", (req, res) => {
  pool.query("select * from users", (error, results) => {
    if (error) {
      throw error;
    }
    return res.status(200).json(results.rows);
  });
});

//ユーザー情報をすべて取得し、idの降順にする
app.get("/users/desc", (req, res) => {
  pool.query("select * from users order by ID desc", (error, results) => {
    if (error) {
      throw error;
    }
    return res.status(200).json(results.rows);
  });
});

//特定のユーザーを取得する
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  pool.query("select * from users where ID = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    return res.status(200).json(results.rows);
  });
});

//ユーザーを追加する
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  // ユーザーがすでに存在しているか確認;
  pool.query(
    "select 1 from users where email = $1",
    [email],
    (error, results) => {
      if (results.rows.length) {
        res.send("すでにユーザーが存在しています");
      } else {
        pool.query(
          "insert into users(name, email, age) values($1, $2, $3)",
          [name, email, age],
          (error, results) => {
            if (error) {
              throw error;
            }
            return res.status(201).send("ユーザー作成に成功しました");
          }
        );
      }
    }
  );
});

//ユーザーを削除する
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  // IDがすでに存在しているか確認;
  pool.query("select 1 from users where ID = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      res.send("ユーザーが存在しません");
    } else {
      pool.query("delete from users where ID = $1", [id], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send("削除に成功しました");
      });
    }
  });
});

//ユーザーを更新する
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  // IDがすでに存在しているか確認;
  pool.query("select 1 from users where ID = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      res.send("ユーザーが存在しません");
    } else {
      pool.query(
        "update users set name = $1 where ID = $2",
        [name, id],
        (error, results) => {
          if (error) {
            throw error;
          }
          return res.status(200).send("更新に成功しました");
        }
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
