const API_BASE_URL= "https://todo-frontend-p05u.onrender.com";


document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch('${API_BASE_URL}/auth/token', {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    alert("Invalid credentials");
    return;
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  window.location.href = "index.html";
});
