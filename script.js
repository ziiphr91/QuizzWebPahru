const questions = [
    { q: "Tag HTML manakah yang benar untuk membuat teks menjadi tebal (bold)?", a: "<b>", o: ["<break>", "<b>", "<bold>", "<heavy>", "<strong>"] },
    { q: "Simbol apakah yang digunakan untuk menandai ID di CSS?", a: "#", o: [".", "#", "*", "&", "!"] },
    { q: "Setiap baris kode PHP harus diakhiri dengan simbol...", a: "Titik koma (;)", o: ["Titik (.)", "Titik koma (;)", "Koma (,)", "Seru (!)", "Garis miring (/)"] },
    { q: "Properti CSS mana yang digunakan untuk mengubah warna teks?", a: "color", o: ["text-color", "fgcolor", "font-style", "color", "text-style"] },
    { q: "Cara penulisan variabel yang benar di PHP adalah...", a: "$nama_variabel", o: ["var nama_variabel", "$nama_variabel", "@nama_variabel", "int nama_variabel", "#nama_variabel"] },
    { q: "Tag HTML yang digunakan untuk membuat daftar poin (bullet) adalah...", a: "<ul>", o: ["<ol>", "<ul>", "<li>", "<dl>", "<list>"] },
    { q: "Untuk membuat latar belakang warna di CSS, kita menggunakan...", a: "background-color", o: ["color-bg", "background-color", "bgcolor", "set-color", "background-set"] },
    { q: "Fungsi echo di PHP digunakan untuk...", a: "Menampilkan teks ke layar", o: ["Menghapus data", "Menampilkan teks ke layar", "Menghitung angka", "Membuat file baru", "Menyimpan data"] },
    { q: "Atribut href biasanya ditemukan di dalam tag...", a: "<a>", o: ["<img>", "<link>", "<a>", "<p>", "<div>"] },
    { q: "Properti CSS untuk mengatur ukuran font adalah...", a: "font-size", o: ["text-size", "font-weight", "font-style", "font-size", "font-color"] },
    { q: "Ekstensi file yang digunakan untuk menjalankan kode PHP adalah...", a: ".php", o: [".html", ".js", ".php", ".css", ".java"] },
    { q: "Tag HTML untuk membuat baris baru (pindah baris) adalah...", a: "<br>", o: ["<lb>", "<br>", "<break>", "<hr>", "<new>"] },
    { q: "Di CSS, properti untuk mengatur jarak di LUAR kotak elemen adalah...", a: "margin", o: ["padding", "spacing", "margin", "border", "outside"] },
    { q: "Perintah PHP untuk mengambil data dari form dengan method GET adalah...", a: "$_GET", o: ["$GET", "$_GET", "@GET", "get_data", "$_POST"] },
    { q: "Judul paling besar dalam HTML menggunakan tag...", a: "<h1>", o: ["<h6>", "<head>", "<h10>", "<h1>", "<title>"] },
    { q: "Properti CSS untuk mengatur teks agar berada di tengah adalah...", a: "text-align: center", o: ["align: center", "text-middle: true", "text-align: center", "vertical-align: center", "center-text"] },
    { q: "Komentar di PHP yang menggunakan satu baris diawali dengan...", a: "//", o: ["/*", "//", "<!--", "#--", "##"] },
    { q: "Tag HTML yang digunakan untuk memasukkan gambar adalah...", a: "<img>", o: ["<pic>", "<img>", "<image>", "<src>", "<photo>"] },
    { q: "Manakah yang merupakan penulisan CSS internal yang benar?", a: "Di dalam tag <style>", o: ["Di dalam tag <script>", "Di dalam tag <style>", "Di dalam tag <css>", "Di dalam file .txt", "Di dalam tag <php>"] },
    { q: "Apa kegunaan dari tag <title>?", a: "Mengatur judul pada tab browser", o: ["Membuat judul di dalam halaman", "Mengatur judul pada tab browser", "Menentukan nama file", "Membuat teks menjadi besar", "Mengubah warna halaman"] }
];

let currentIdx = 0;
let userAnswers = new Array(questions.length).fill(null);

const authContainer = document.getElementById("auth-container");
const quizContainer = document.getElementById("quiz-container");

const authTitle = document.getElementById("auth-title");
const authBtn = document.getElementById("auth-btn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = true;
let currentUser = null;

document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "toggle-text") {
        isLogin = !isLogin;
        authTitle.innerText = isLogin ? "Login" : "Daftar";
        authBtn.innerText = isLogin ? "Login" : "Daftar";
        document.getElementById("toggle-auth").innerHTML =
            isLogin
            ? `Belum punya akun? <span id="toggle-text">Daftar</span>`
            : `Sudah punya akun? <span id="toggle-text">Login</span>`;
    }
});

authBtn.onclick = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Isi username dan password");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
        const user = users.find(
            u => u.username === username && u.password === password
        );
        if (!user) {
            alert("Username atau password salah");
            return;
        }
        currentUser = user;
    } else {
        const exists = users.find(
            u => u.username === username
        );
        if (exists) {
            alert("Username sudah digunakan");
            return;
        }
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Pendaftaran berhasil");
        return;
    }

    authContainer.style.display = "none";
    quizContainer.style.display = "block";
    userDisplay.innerText = `Login sebagai: ${currentUser.username}`;

    loadHistory();
    startQuiz();
};

logoutBtn.onclick = () => {
    location.reload();
};

const qText = document.getElementById('question-text');
const optContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const qNum = document.getElementById('question-number');
const quizFooter = document.getElementById('quiz-footer');
const questionList = document.getElementById('question-list');
const timerElement = document.getElementById('timer');

let timeLeft = 30 * 60;
let timerInterval;

quizFooter.style.display = "flex";
quizFooter.style.gap = "10px";

const prevBtn = document.createElement('button');
prevBtn.id = "prev-btn";
prevBtn.innerText = "Sebelumnya";
prevBtn.style.background = "#64748b";
quizFooter.prepend(prevBtn);

function startQuiz() {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    loadQuestion();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.innerText =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        showResults();
        return;
    }
    timeLeft--;
}

function loadQuestion() {
    const current = questions[currentIdx];
    qText.innerText = current.q;
    qNum.innerText = `Soal ${currentIdx + 1} dari ${questions.length}`;
    progress.style.width = `${((currentIdx + 1) / questions.length) * 100}%`;

    prevBtn.disabled = currentIdx === 0;
    nextBtn.innerText = currentIdx === questions.length - 1 ? "Selesai" : "Selanjutnya";
    nextBtn.disabled = userAnswers[currentIdx] === null;

    optContainer.innerHTML = '';
    const labels = ["A", "B", "C", "D", "E"];

    current.o.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        if (userAnswers[currentIdx] === option) {
            div.classList.add('selected');
        }
        div.innerText = `${labels[index]}. ${option}`;
        div.onclick = () => {
            userAnswers[currentIdx] = option;
            loadQuestion();
        };
        optContainer.appendChild(div);
    });

    questionList.innerHTML = "";
    questions.forEach((_, index) => {
        const box = document.createElement("div");
        box.className = "question-number-box";
        if (index === currentIdx) {
            box.classList.add("active");
        }
        if (userAnswers[index] !== null) {
            box.classList.add("answered");
        }
        box.innerText = index + 1;
        box.onclick = () => {
            currentIdx = index;
            loadQuestion();
        };
        questionList.appendChild(box);
    });
}

nextBtn.onclick = () => {
    if (currentIdx < questions.length - 1) {
        currentIdx++;
        loadQuestion();
    } else {
        showResults();
    }
};

prevBtn.onclick = () => {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuestion();
    }
};

function showResults() {
    clearInterval(timerInterval);
    let scoreCorrect = 0;
    let scoreWrong = 0;

    questions.forEach((item, index) => {
        if (userAnswers[index] === item.a) {
            scoreCorrect++;
        } else {
            scoreWrong++;
        }
    });

    document.getElementById('result-modal').style.display = 'flex';
    document.getElementById('correct-count').innerText = scoreCorrect;
    document.getElementById('wrong-count').innerText = scoreWrong;

    saveHistory(scoreCorrect, scoreWrong);
    loadHistory();
}

function saveHistory(correct, wrong) {
    let histories = JSON.parse(localStorage.getItem("histories")) || [];
    histories.push({
        username: currentUser.username,
        correct,
        wrong,
        date: new Date().toLocaleString("id-ID")
    });
    localStorage.setItem("histories", JSON.stringify(histories));
}

function loadHistory() {
    const historyList = document.getElementById("history-list");
    let histories = JSON.parse(localStorage.getItem("histories")) || [];
    const userHistory = histories.filter(item => item.username === currentUser.username);

    historyList.innerHTML = "";

    if (userHistory.length === 0) {
        historyList.innerHTML = "<p>Belum ada riwayat ujian</p>";
        return;
    }

    userHistory.reverse().forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <div class="history-info">
                <strong>${item.username}</strong><br>
                Benar: ${item.correct} | Salah: ${item.wrong}<br>
                <small style="color: #cbd5e1;">${item.date}</small>
            </div>
            <button class="delete-history-btn" data-index="${index}">Hapus</button>
        `;
        historyList.appendChild(div);
    });

    const deleteButtons = document.querySelectorAll(".delete-history-btn");
    deleteButtons.forEach(button => {
        button.onclick = () => {
            const deleteIndex = parseInt(button.dataset.index);
            let allHistories = JSON.parse(localStorage.getItem("histories")) || [];
            const filteredUserHistory = allHistories.filter(
                item => item.username === currentUser.username
            ).reverse();

            const selectedHistory = filteredUserHistory[deleteIndex];

            allHistories = allHistories.filter(item =>
                !(
                    item.username === selectedHistory.username &&
                    item.correct === selectedHistory.correct &&
                    item.wrong === selectedHistory.wrong &&
                    item.date === selectedHistory.date
                )
            );

            localStorage.setItem("histories", JSON.stringify(allHistories));
            loadHistory();
        };
    });
}

function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
    currentIdx = 0;
    userAnswers = new Array(questions.length).fill(null);
    timeLeft = 30 * 60;

    clearInterval(timerInterval);
    nextBtn.disabled = true;
    prevBtn.disabled = false;

    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    loadQuestion();
}
