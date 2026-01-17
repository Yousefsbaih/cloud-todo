// 🔹 Your specific Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvXHr5nJXHVyDcCymd_6LhMMN3rTOf1Yk",
    authDomain: "cloud-todo-37ba2.firebaseapp.com",
    projectId: "cloud-todo-37ba2",
    storageBucket: "cloud-todo-37ba2.firebasestorage.app",
    messagingSenderId: "962038567203",
    appId: "1:962038567203:web:be54ac8c249443f4817c96"
  };
  
  // Initialize Firebase (using compat mode for the scripts in your HTML)
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // ... The rest of the functions (register, login, etc.) stay exactly the same!
// Register user
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Registration successful"))
        .catch(err => alert(err.message));
}

// Login user
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("todo-section").style.display = "block";
            loadTasks();
        })
        .catch(err => alert(err.message));
}

// Logout
function logout() {
    auth.signOut();
    location.reload();
}

// Add task
function addTask() {
    const task = document.getElementById("taskInput").value;
    const user = auth.currentUser;
    if (task) {
        db.collection("tasks").add({
            text: task,
            uid: user.uid
        });
        document.getElementById("taskInput").value = "";
    }
}

// Load tasks
function loadTasks() {
    const user = auth.currentUser;
    db.collection("tasks")
        .where("uid", "==", user.uid)
        .onSnapshot(snapshot => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";
            snapshot.forEach(doc => {
                const li = document.createElement("li");
                li.textContent = doc.data().text;
                const btn = document.createElement("button");
                btn.textContent = "Delete";
                btn.onclick = () => db.collection("tasks").doc(doc.id).delete();
                li.appendChild(btn);
                list.appendChild(li);
            });
        });
}