// === ĐỒNG HỒ ĐẾM NGƯỢC ===
let totalSeconds=90*60
const countdownElement=document.getElementById('countdown')

const timerInterval=setInterval(() => {
    let minutes=Math.floor(totalSeconds/60);
    let seconds=totalSeconds%60;

    minutes=minutes<10 ? '0'+minutes:minutes;
    seconds=seconds<10 ? '0'+seconds:seconds;

    countdownElement.textContent=`${minutes}:${seconds}`;

    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        alert("Đã hết 90 phút làm bài! Hệ thống sẽ tự động nộp bài của bạn.");
        window.location.href = "ketqua.html"; 
    }
    totalSeconds--;
}, 1000);

// ==========================================
// PHẦN 1: KHAI BÁO BIẾN (TÓM CÁC PHẦN TỬ)
// ==========================================

// 1. Nhóm phần tử của Nộp Bài
const nutNopBai = document.getElementById('trigger-nopbai');
const popupNopBai = document.getElementById('overlay-nopbai');
const nutDongNopBai = popupNopBai.querySelector('.btn-close'); // Tìm nút Đóng nằm bên trong popup này

// 2. Nhóm phần tử của Thoát Ra
const nutThoat = document.getElementById('trigger-thoat');
const popupThoat = document.getElementById('overlay-thoat');
const nutDongThoat = popupThoat.querySelector('.btn-close');


// ==========================================
// PHẦN 2: GẮN SỰ KIỆN (BẬT/TẮT CÔNG TẮC)
// ==========================================

// --- XỬ LÝ CHỨC NĂNG NỘP BÀI ---

// Mở popup Nộp Bài
nutNopBai.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn trình duyệt tự động cuộn lên đầu trang
    popupNopBai.classList.add('open'); // Gắn chìa khóa .open để hiện popup
});

// Đóng popup Nộp Bài
nutDongNopBai.addEventListener('click', function() {
    popupNopBai.classList.remove('open'); // Rút chìa khóa .open để ẩn popup đi
});


// --- XỬ LÝ CHỨC NĂNG THOÁT RA ---

// Mở popup Thoát Ra
nutThoat.addEventListener('click', function(event) {
    event.preventDefault();
    popupThoat.classList.add('open');
});

// Đóng popup Thoát Ra
nutDongThoat.addEventListener('click', function() {
    popupThoat.classList.remove('open');
});
