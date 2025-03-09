"use strict";

const userForm = document.getElementById("userForm");
const userId = document.getElementById("id");
const email = document.getElementById("email");
const userName = document.getElementById("name");
const age = document.getElementById("age");
const registerBtn = document.getElementById("registerBtn");
const updateBtn = document.getElementById("updateBtn");

//ユーザーを追加
registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    email: email.value,
    name: userName.value,
    age: age.value,
  };

  try {
    const response = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.text();
    alert(result);
    if (response.ok) {
      document.getElementById("userForm").reset();
      fetchUsers();
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    alert("登録に失敗しました");
  }
});

//ユーザーを更新
updateBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const id = userId.value;
  const formData = {
    email: email.value,
    name: userName.value,
    age: age.value,
  };

  try {
    const response = await fetch(`http://localhost:8000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.text();
    alert(result);
    if (response.ok) {
      document.getElementById("userForm").reset();
      registerBtn.classList.remove("display-none");
      updateBtn.classList.add("display-none");
      fetchUsers();
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    alert("更新に失敗しました");
  }
});

//ユーザーを削除
async function deleteUser(id) {
  try {
    const response = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.text();
    alert(result);
    if (response.ok) {
      fetchUsers();
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    alert("削除に失敗しました");
  }
}

// ユーザー一覧を取得して表示する関数
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8000/users");
    const users = await response.json();

    const tableBody =
      document.querySelector("#userTable tbody") || createUserTable();
    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>
            <button class="action-btn" onclick="clickUpdate(${user.id}); return false;">
              <i class="fas fa-edit"></i> 編集
            </button>
          </td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
          <td>
            <button class="action-btn delete-btn" onclick="deleteUser(${user.id}); return false;">
              <i class="fas fa-trash"></i> 削除
            </button>
          </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました:", error);
  }
}

// ユーザーを取得して表示する関数
async function fetchUserById(id) {
  try {
    const response = await fetch(`http://localhost:8000/users/${id}`);
    const users = await response.json();
    return users[0];
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました:", error);
  }
}

// テーブルを作成
function createUserTable() {
  const tableHTML = `
      <h2 class="mt20"><i class="fas fa-list"></i> ユーザー一覧</h2>
      <table id="userTable">
        <thead>
          <tr>
            <th>操作</th>
            <th>名前</th>
            <th>メールアドレス</th>
            <th>年齢</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

  const container = document.getElementById("tableWrap");
  container.innerHTML = tableHTML;
  return document.querySelector("#userTable tbody");
}

async function clickUpdate(id) {
  const user = await fetchUserById(id);
  userId.value = user.id;
  email.value = user.email;
  userName.value = user.name;
  age.value = user.age;
  registerBtn.classList.add("display-none");
  updateBtn.classList.remove("display-none");
  
  // スクロールをフォームに戻す
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// グローバルスコープで関数を定義（HTML内のonclickで使用するため）
window.clickUpdate = clickUpdate;
window.deleteUser = deleteUser;

// ページ読み込み時にユーザー一覧を表示
document.addEventListener("DOMContentLoaded", fetchUsers);
