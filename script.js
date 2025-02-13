//const apiUrl = "https://blogapp-10095667483.development.catalystappsail.com/api/v1";
const apiUrl = "https://rps-blogs-10095674266.catalystappsail.com/api/v1";


// Signup
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
        alert("Signup successful. Please sign in.");
        window.location.href = "signin.html";
    } else {
        alert("Signup failed.");
    }
});

// Signin
document.getElementById("signin-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
        const token = await res.text();
        localStorage.setItem("token", token);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials.");
    }
});

// Fetch Blogs
async function fetchBlogs() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
        const blogs = await res.json();
        const container = document.getElementById("blog-container");
        container.innerHTML = blogs.map((blog) => `
            <div>
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
                <button onclick="updateBlog(${blog.id})">Edit</button>
                <button onclick="deleteBlog(${blog.id})">Delete</button>
            </div>
        `).join("");
    } else {
        alert("Failed to fetch blogs.");
    }
}

// Create Blog
document.getElementById("create-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const res = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
        alert("Blog created!");
        fetchBlogs();
    } else {
        alert("Failed to create blog.");
    }
});

// ✅ Update Blog (PUT)
async function updateBlog(id) {
    const token = localStorage.getItem("token");
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");

    if (!newTitle || !newContent) {
        alert("Title and content are required.");
        return;
    }

    const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
    });

    if (res.ok) {
        alert("Blog updated successfully!");
        fetchBlogs();
    } else {
        alert("Failed to update blog.");
    }
}

// ✅ Delete Blog (DELETE)
async function deleteBlog(id) {
    const token = localStorage.getItem("token");

    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
        alert("Blog deleted successfully!");
        fetchBlogs();
    } else {
        alert("Failed to delete blog.");
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "signin.html";
}

// Load Blogs on Dashboard
if (document.getElementById("blog-container")) fetchBlogs();
