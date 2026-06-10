document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ĐỒNG HỒ ĐẾM NGƯỢC (90 PHÚT)
    // ==========================================
    let totalSeconds = 90 * 60;
    const countdownElement = document.getElementById('countdown');

    if (countdownElement) {
        const timerInterval = setInterval(() => {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            countdownElement.textContent = `${minutes}:${seconds}`;

            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                alert("Đã hết 90 phút làm bài! Hệ thống sẽ tự động nộp bài của bạn.");
                window.location.href = "ketqua.html"; 
            }
            totalSeconds--;
        }, 1000);
    }


    // ==========================================
    // 2. KHAI BÁO BIẾN CÁC PHẦN TỬ GIAO DIỆN
    // ==========================================
    // Nhóm Nộp Bài
    const nutNopBai = document.getElementById('trigger-nopbai');
    const popupNopBai = document.getElementById('overlay-nopbai');
    const nutDongNopBai = popupNopBai ? popupNopBai.querySelector('.btn-close') : null;

    // Nhóm Thoát Ra
    const nutThoat = document.getElementById('trigger-thoat');
    const popupThoat = document.getElementById('overlay-thoat');
    const nutDongThoat = popupThoat ? popupThoat.querySelector('.btn-close') : null;

    // Nhóm Đề bài & Palette (Tính năng cốt lõi)
    const markButtons = document.querySelectorAll('.btn-mark');
    const answerInputs = document.querySelectorAll('input[data-target]');


    // ==========================================
    // 3. XỬ LÝ SỰ KIỆN POPUP (BẬT/TẮT)
    // ==========================================
    // --- Popup Nộp Bài ---
    if (nutNopBai && popupNopBai) {
        nutNopBai.addEventListener('click', function(event) {
            event.preventDefault(); 
            popupNopBai.classList.add('open'); 
        });
    }
    if (nutDongNopBai && popupNopBai) {
        nutDongNopBai.addEventListener('click', function() {
            popupNopBai.classList.remove('open'); 
        });
    }

    // --- Popup Thoát Ra ---
    if (nutThoat && popupThoat) {
        nutThoat.addEventListener('click', function(event) {
            event.preventDefault();
            popupThoat.classList.add('open');
        });
    }
    if (nutDongThoat && popupThoat) {
        nutDongThoat.addEventListener('click', function() {
            popupThoat.classList.remove('open');
        });
    }


    // ==========================================
    // 4. XỬ LÝ TÍNH NĂNG ĐỒNG BỘ ĐỀ THI & PALETTE
    // ==========================================
    
    // --- Click nút ĐÁNH DẤU (MARK ĐỎ) ---
    markButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Chống reload trang hoặc nhảy trang vô cớ
            
            // Nút câu hỏi luôn đổi màu trước
            this.classList.toggle('is-marked');
            
            // Tìm ô vuông tương ứng bên Palette để đổi màu theo
            const targetId = this.getAttribute('data-target');
            const paletteElement = document.getElementById(targetId);
            
            if (paletteElement) {
                paletteElement.classList.toggle('is-marked');
            } else {
                console.warn(`Không tìm thấy ô số Palette có id="${targetId}"`);
            }
        });
    });

    // --- Khi học sinh CHỌN ĐÁP ÁN (ANSWERED TÍM) ---
    answerInputs.forEach(input => {
        input.addEventListener('input', function() {
            const targetId = this.getAttribute('data-target');
            const paletteElement = document.getElementById(targetId);
            
            if (paletteElement) {
                if (this.type === 'radio') {
                    // Nếu là trắc nghiệm single-choice, cứ click là tính đã làm
                    paletteElement.classList.add('is-answered');
                } else {
                    // Nếu là ô điền số/chữ, phải nhập nội dung mới tính đã làm
                    if (this.value.trim() !== "") {
                        paletteElement.classList.add('is-answered');
                    } else {
                        paletteElement.classList.remove('is-answered');
                    }
                }
            }
        });
    });

});
