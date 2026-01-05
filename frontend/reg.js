const API_BASE_URL= "https://todo-frontend-p05u.onrender.com";

document.getElementById("registerBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  const res = await fetch("${API_BASE_URL}/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert("Registration failed");
    return;
  }

  alert("Registered successfully");
  window.location.href = "login.html";
});
