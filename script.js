const questions = [
    { q: "Tag HTML manakah yang benar untuk membuat teks menjadi tebal (bold)?", a: "<b>", o: ["<break>", "<b>", "<bold>", "<heavy>"] },
    { q: "Simbol apakah yang digunakan untuk menandai ID di CSS?", a: "#", o: [".", "#", "*", "&"] },
    { q: "Setiap baris kode PHP harus diakhiri dengan simbol...", a: "Titik koma (;)", o: ["Titik (.)", "Titik koma (;)", "Koma (,)", "Seru (!)"] },
    { q: "Properti CSS mana yang digunakan untuk mengubah warna teks?", a: "color", o: ["text-color", "fgcolor", "font-style", "color"] },
    { q: "Cara penulisan variabel yang benar di PHP adalah...", a: "$nama_variabel", o: ["var nama_variabel", "$nama_variabel", "@nama_variabel", "int nama_variabel"] },
    { q: "Tag HTML yang digunakan untuk membuat daftar poin (bullet) adalah...", a: "<ul>", o: ["<ol>", "<ul>", "<li>", "<dl>"] },
    { q: "Untuk membuat latar belakang warna di CSS, kita menggunakan...", a: "background-color", o: ["color-bg", "background-color", "bgcolor", "set-color"] },
    { q: "Fungsi echo di PHP digunakan untuk...", a: "Menampilkan teks ke layar", o: ["Menghapus data", "Menampilkan teks ke layar", "Menghitung angka", "Membuat file baru"] },
    { q: "Atribut href biasanya ditemukan di dalam tag...", a: "<a>", o: ["<img>", "<link>", "<a>", "<p>"] },
    { q: "Properti CSS untuk mengatur ukuran font adalah...", a: "font-size", o: ["text-size", "font-weight", "font-style", "font-size"] },
    { q: "Ekstensi file yang digunakan untuk menjalankan kode PHP adalah...", a: ".php", o: [".html", ".js", ".php", ".css"] },
    { q: "Tag HTML untuk membuat baris baru (pindah baris) adalah...", a: "<br>", o: ["<lb>", "<br>", "<break>", "<hr>"] },
    { q: "Di CSS, properti untuk mengatur jarak di LUAR kotak elemen adalah...", a: "margin", o: ["padding", "spacing", "margin", "border"] },
    { q: "Perintah PHP untuk mengambil data dari form dengan method GET adalah...", a: "$_GET", o: ["$GET", "$_GET", "@GET", "get_data"] },
    { q: "Judul paling besar dalam HTML menggunakan tag...", a: "<h1>", o: ["<h6>", "<head>", "<h10>", "<h1>"] },
    { q: "Properti CSS untuk mengatur teks agar berada di tengah adalah...", a: "text-align: center", o: ["align: center", "text-middle: true", "text-align: center", "vertical-align: center"] },
    { q: "Komentar di PHP yang menggunakan satu baris diawali dengan...", a: "//", o: ["/*", "//", "<!--", "#--"] },
    { q: "Tag HTML yang digunakan untuk memasukkan gambar adalah...", a: "<img>", o: ["<pic>", "<img>", "<image>", "<src>"] },
    { q: "Manakah yang merupakan penulisan CSS internal yang benar?", a: "Di dalam tag <style>", o: ["Di dalam tag <script>", "Di dalam tag <style>", "Di dalam tag <css>", "Di dalam file .txt"] },
    { q: "Apa kegunaan dari tag <title>?", a: "Mengatur judul pada tab browser", o: ["Membuat judul di dalam halaman", "Mengatur judul pada tab browser", "Menentukan nama file", "Membuat teks menjadi besar"] }
];

let currentIdx = 0;
let userAnswers = new Array(questions.length).fill(null);

const qText = document.getElementById('question-text');
const optContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const qNum = document.getElementById('question-number');
const quizFooter = document.getElementById('quiz-footer');
const questionList = document.getElementById('question-list');

quizFooter.style.display = "flex";
quizFooter.style.gap = "10px";

const prevBtn = document.createElement('button');

prevBtn.id = "prev-btn";
prevBtn.innerText = "Sebelumnya";
prevBtn.style.background = "#64748b";

quizFooter.prepend(prevBtn);

function loadQuestion() {
    const current = questions[currentIdx];

    qText.innerText = current.q;

    qNum.innerText = `Soal ${currentIdx + 1} dari ${questions.length}`;

    progress.style.width = `${((currentIdx + 1) / questions.length) * 100}%`;

    prevBtn.disabled = currentIdx === 0;

    nextBtn.innerText =
        currentIdx === questions.length - 1
        ? "Selesai"
        : "Selanjutnya";

    nextBtn.disabled = userAnswers[currentIdx] === null;

    optContainer.innerHTML = '';

    current.o.forEach(option => {
        const div = document.createElement('div');

        div.className = 'option';

        if (userAnswers[currentIdx] === option) {
            div.classList.add('selected');
        }

        div.innerText = option;

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
}

loadQuestion();