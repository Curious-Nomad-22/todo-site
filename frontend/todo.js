const API = "https://todo-site-1ql4.onrender.com";
const token = localStorage.getItem("access_token");

let Notes = [
    { id: '1', text: 'Welcome to your todo list!', completed: false },
    { id: '2', text: 'Click the checkbox to mark items complete', completed: false },
    { id: '3', text: 'Hover over items to delete them', completed: false }
];




// 🔐 redirect if not logged in
if (!token) {
    window.location.href = "login.html";
}

// --------------------
// FETCH NOTES
// --------------------
async function loadNotes() {
    const res = await fetch(`${API}/notes`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        alert("Failed to load notes");
        return;
    }

    notes = await res.json();
    renderNotes();
}

// --------------------
// RENDER NOTES (UI LOGIC PRESERVED)
// --------------------
function renderNotes() {
    const todosList = document.getElementById('todosList');
    const progress = document.getElementById('progress');

    if (notes.length === 0) {
        todosList.innerHTML =
            '<div class="empty-state"><p>No tasks yet. Add one above to get started!</p></div>';
        progress.style.display = 'none';
        return;
    }

    todosList.innerHTML = notes.map(note => `
        <div class="todo-item">
            <div class="checkbox-wrapper">
                <input
                    type="checkbox"
                    class="checkbox"
                    id="note-${note.id}"
                    ${note.completed ? 'checked' : ''}
                    onchange="toggleComplete(${note.id})"
                />
            </div>

            <label
                for="note-${note.id}"
                class="todo-label ${note.completed ? 'completed' : ''}"
            >
                ${escapeHtml(note.note)}
            </label>

            <button class="delete-button" onclick="deleteNote(${note.id})">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
            </button>
        </div>
    `).join('');

    const completedCount = notes.filter(n => n.completed).length;
    progress.innerHTML = `<p>${completedCount} of ${notes.length} tasks completed</p>`;
    progress.style.display = 'block';
}

// --------------------
// ADD NOTE
// --------------------
async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (!text) return;

    const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ note: text })
    });

    if (!res.ok) {
        alert("Failed to add note");
        return;
    }

    input.value = '';
    loadNotes();
}

// --------------------
// TOGGLE NOTE
// --------------------
async function toggleComplete(id) {
    await fetch(`${API}/notes/${id}/toggle`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    loadNotes();
}

// --------------------
// DELETE NOTE
// --------------------
async function deleteNote(id) {
    await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    loadNotes();
}

// --------------------
// ESCAPE HTML
// --------------------
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --------------------
// ENTER KEY HANDLER
// --------------------
document.getElementById('todoInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') addTodo();
});

// --------------------
// INITIAL LOAD
// --------------------
loadNotes();
