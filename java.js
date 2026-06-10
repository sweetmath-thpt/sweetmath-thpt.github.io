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

    // Nhóm Đề bài & Palette (Bảng tiến độ câu hỏi)
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
            event.preventDefault(); 
            
            // Bật/tắt trạng thái mark trên chính nút bấm
            this.classList.toggle('is-marked');
            
            // Bật/tắt trạng thái mark trên ô số tương ứng ở Palette
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
            
            // [UX NÂNG CẤP]: BỘ LỌC CHUẨN BỘ GD-ĐT CHO Ô TRẢ LỜI NGẮN
            if (this.classList.contains('moe-format')) {
                let val = this.value;

                // 1. Tự động đổi dấu chấm thành dấu phẩy (Ví dụ: 1.5 -> 1,5)
                val = val.replace(/\./g, ',');

                // 2. Chặn sạch ký tự lạ, chỉ giữ lại: số, dấu phẩy, dấu trừ
                val = val.replace(/[^0-9,-]/g, '');

                // 3. Xử lý dấu trừ (-): Chỉ cho phép ở đầu câu (Ví dụ: -5). Nếu nằm ở giữa sẽ bị bốc hơi
                if (val.indexOf('-') > 0) {
                    let hasMinusAtStart = val.startsWith('-');
                    val = val.replace(/-/g, '');
                    if (hasMinusAtStart) val = '-' + val;
                }

                // 4. Xử lý dấu phẩy (,): Chỉ cho phép xuất hiện duy nhất một dấu phẩy
                const parts = val.split(',');
                if (parts.length > 2) {
                    val = parts[0] + ',' + parts.slice(1).join('');
                }

                // Cập nhật lại chuỗi sạch vào input công khai
                this.value = val;
            }

            // --- ĐỒNG BỘ MÀU TÍM (IS-ANSWERED) LÊN PALETTE ---
            const targetId = this.getAttribute('data-target');
            const paletteElement = document.getElementById(targetId);
            
            if (paletteElement) {
                if (this.type === 'radio') {
                    // Đối với trắc nghiệm chọn A, B, C, D
                    paletteElement.classList.add('is-answered');
                } else {
                    // Đối với ô trả lời ngắn (phải có chữ/số mới tính)
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
