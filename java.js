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
    const nutNopBai = document.getElementById('trigger-nopbai');
    const popupNopBai = document.getElementById('overlay-nopbai');
    const nutDongNopBai = popupNopBai ? popupNopBai.querySelector('.btn-close') : null;

    const nutThoat = document.getElementById('trigger-thoat');
    const popupThoat = document.getElementById('overlay-thoat');
    const nutDongThoat = popupThoat ? popupThoat.querySelector('.btn-close') : null;

    const markButtons = document.querySelectorAll('.btn-mark');
    const answerInputs = document.querySelectorAll('input[data-target]');

    // ==========================================
    // 3. XỬ LÝ SỰ KIỆN POPUP (BẬT/TẮT)
    // ==========================================
    if (nutNopBai && popupNopBai) {
        nutNopBai.addEventListener('click', e => { e.preventDefault(); popupNopBai.classList.add('open'); });
    }
    if (nutDongNopBai && popupNopBai) {
        nutDongNopBai.addEventListener('click', () => popupNopBai.classList.remove('open'));
    }

    if (nutThoat && popupThoat) {
        nutThoat.addEventListener('click', e => { e.preventDefault(); popupThoat.classList.add('open'); });
    }
    if (nutDongThoat && popupThoat) {
        nutDongThoat.addEventListener('click', () => popupThoat.classList.remove('open'));
    }

    // ==========================================
    // 4. XỬ LÝ TÍNH NĂNG ĐỒNG BỘ ĐỀ THI & PALETTE
    // ==========================================
    
    // --- Click nút ĐÁNH DẤU (MARK ĐỎ) ---
    markButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            // Bật/tắt trạng thái đỏ trên chính nút Đánh dấu ở đề bài
            this.classList.toggle('is-marked');
            
            // Bật/tắt trạng thái đỏ trên ô số tương ứng ở bảng Palette
            const targetId = this.getAttribute('data-target');
            const paletteElement = document.getElementById(targetId);
            
            if (paletteElement) {
                paletteElement.classList.toggle('is-marked');
            }
        });
    });

    // --- Khi học sinh CHỌN ĐÁP ÁN (RADIO HOẶC ĐIỀN TỪ) ---
    answerInputs.forEach(input => {
        input.addEventListener('input', function() {
            
            // Xử lý bộ lọc cho ô trả lời ngắn chuẩn Bộ GD-ĐT
            if (this.classList.contains('moe-format')) {
                let val = this.value;
                val = val.replace(/\./g, ',');
                val = val.replace(/[^0-9,-]/g, '');
                if (val.indexOf('-') > 0) {
                    let hasMinusAtStart = val.startsWith('-');
                    val = val.replace(/-/g, '');
                    if (hasMinusAtStart) val = '-' + val;
                }
                const parts = val.split(',');
                if (parts.length > 2) {
                    val = parts[0] + ',' + parts.slice(1).join('');
                }
                this.value = val;
            }

            // Đồng bộ trạng thái "Đã làm bài" (is-answered)
            const targetId = this.getAttribute('data-target');
            const paletteElement = document.getElementById(targetId);
            
            if (paletteElement) {
                if (this.type === 'radio') {
                    paletteElement.classList.add('is-answered');
                } else {
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
