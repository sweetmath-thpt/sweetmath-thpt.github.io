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
// =========================================================================
    // 5. TỰ ĐỘNG CHẤM ĐIỂM DỰA VÀO TÊN FILE & LƯU KẾT QUẢ VÀO LOCALSTORAGE
    // =========================================================================
    const btnXacNhanNop = document.querySelector('#overlay-nopbai .btn-confirm');

    if (btnXacNhanNop) {
        btnXacNhanNop.addEventListener('click', function(event) {
            event.preventDefault(); 

            const nganHangDapAn = {
                'lambai.html': {
                    'tenDe': 'Bài thi thử thiết kế Demo',
                    'dapAn': { 'q1': 'D', 'q2': 'S', 'q3': '2' }
                },
                'de-01.html': {
                    'tenDe': 'Đề thi chính thức số 01',
                    'dapAn': { 'q1': 'A', 'q2': 'D', 'q3': '15' }
                },
                'de-02.html': {
                    'tenDe': 'Đề thi chính thức số 02',
                    'dapAn': { 'q1': 'B', 'q2': 'S', 'q3': '100' }
                }
            };

            const tenFileHienTai = window.location.pathname.split('/').pop() || 'lambai.html';

            if (!nganHangDapAn[tenFileHienTai]) {
                alert("Hệ thống chưa cập nhật đáp án cho file đề thi này!");
                return;
            }

            const thongTinDeThi = nganHangDapAn[tenFileHienTai];
            const boDapAnDung = thongTinDeThi.dapAn;

            let soCauDung = 0;
            const tongSoCau = Object.keys(boDapAnDung).length;
            
            // 🌟 [MỚI] TẠO "CUỐN SỔ" ĐỂ LƯU CHI TIẾT BÀI LÀM
            let chiTietBaiLam = {}; 

            // Vòng lặp chấm điểm và ghi chép
            for (let questionName in boDapAnDung) {
                const dapAnDung = boDapAnDung[questionName];
                const userRadio = document.querySelector(`input[name="${questionName}"]:checked`);
                const userText = document.querySelector(`input[name="${questionName}"][type="text"]`);

                // 🌟 [MỚI] Biến tạm để nhớ học sinh chọn gì và có đúng không
                let luaChonCuaHocSinh = "Chưa làm"; 
                let laCauDung = false;

                // Kiểm tra câu trắc nghiệm
                if (userRadio) {
                    luaChonCuaHocSinh = userRadio.value;
                    if (userRadio.value === dapAnDung) {
                        soCauDung++;
                        laCauDung = true;
                    }
                } 
                // Kiểm tra câu điền từ
                else if (userText && userText.value.trim() !== "") {
                    luaChonCuaHocSinh = userText.value.trim();
                    if (luaChonCuaHocSinh === dapAnDung) {
                        soCauDung++;
                        laCauDung = true;
                    }
                }

                // 🌟 [MỚI] Ghi chép lại vào sổ
                chiTietBaiLam[questionName] = {
                    chon: luaChonCuaHocSinh, // Học sinh chọn gì
                    dung: dapAnDung,         // Đáp án của hệ thống
                    ketQua: laCauDung        // Đúng (true) hay Sai (false)
                };
            }

            let diemSo = ((soCauDung / tongSoCau) * 10).toFixed(2);
            diemSo = parseFloat(diemSo);

            localStorage.setItem('diemHocSinh', diemSo);
            localStorage.setItem('soCauDung', soCauDung);
            localStorage.setItem('tongSoCau', tongSoCau);
            localStorage.setItem('tenDeThi', thongTinDeThi.tenDe);
            
            // 🌟 [MỚI] ĐÓNG GÓI CUỐN SỔ (ÉP KIỂU JSON) VÀ CẤT VÀO BỘ NHỚ
            localStorage.setItem('chiTietBaiLam', JSON.stringify(chiTietBaiLam));

            window.location.href = this.getAttribute('href');
        });
    }
    // =========================================================================
    // 6. ĐỌC DỮ LIỆU TỪ BỘ NHỚ VÀ ĐỔ RA TRANG KẾT QUẢ (ketqua.html)
    // =========================================================================
    const diemHienThi = document.getElementById('diem-so');
    const soCauHienThi = document.getElementById('so-cau-dung');
    const tenDeHienThi = document.getElementById('ten-de-thi');

    if (diemHienThi && soCauHienThi) {
        // Mở bộ nhớ trình duyệt lấy thông tin ra, nếu không có dữ liệu cũ thì mặc định hiển thị 0
        const diem = localStorage.getItem('diemHocSinh') || 0;
        const dung = localStorage.getItem('soCauDung') || 0;
        const tong = localStorage.getItem('tongSoCau') || 0;
        const tenDe = localStorage.getItem('tenDeThi') || 'KẾT QUẢ BÀI THI';

        // Ép dữ liệu vào các thẻ HTML tương ứng
        tenDeHienThi.textContent = tenDe;
        diemHienThi.textContent = diem;
        soCauHienThi.textContent = dung + " / " + tong + " Câu";
    }
// =========================================================================
    // 7. XỬ LÝ TRANG XEM LẠI BÀI LÀM (Chỉ chạy trên trang xemlaibailam.html)
    // =========================================================================
    const khungXemLai = document.getElementById('khung-xem-lai');

    if (khungXemLai) {
        // A. KHO GIẢI THÍCH CHO MỌI ĐỀ THI
        const khoGiaiThich = {
            'lambai.html': {
                'q1': 'Tháp Tokyo nằm ở Nhật Bản (châu Á), trong khi Tháp Eiffel, Pisa, Big Ben đều nằm ở châu Âu.',
                'q2': 'Georg Cantor là nhà toán học người Đức, nổi tiếng với lý thuyết tập hợp. Do đó phát biểu này là SAI.',
                'q3': 'Vì 1 + 1 = 2 (Phép cộng cơ bản).'
            },
            'de-01.html': {
                'q1': 'Giải thích của đề 1 câu 1...',
                'q2': 'Giải thích của đề 1 câu 2...'
            }
        };

        // B. LẤY DỮ LIỆU TỪ BỘ NHỚ RA
        const chiTietBaiLam = JSON.parse(localStorage.getItem('chiTietBaiLam'));
        const tenFileDeThi = localStorage.getItem('tenFileDeThi'); // Lấy tên file (vd: lambai.html)
        const tenDeThi = localStorage.getItem('tenDeThi'); // Lấy tên hiển thị (vd: Bài thi thử Demo)

        // Hiển thị tên đề
        const xlTenDe = document.getElementById('xl-ten-de');
        if (xlTenDe) xlTenDe.textContent = tenDeThi;

        // C. TỰ ĐỘNG IN RA MÀN HÌNH
        if (chiTietBaiLam && khoGiaiThich[tenFileDeThi]) {
            const boGiaiThichHienTai = khoGiaiThich[tenFileDeThi];

            for (let cauId in chiTietBaiLam) {
                let dataCauHoi = chiTietBaiLam[cauId];
                let loiGiai = boGiaiThichHienTai[cauId] || "Chưa có lời giải cho câu này.";
                
                // Định dạng hiển thị thẻ câu hỏi
                let theCauHoi = document.createElement('div');
                theCauHoi.style.cssText = "background: var(--white); padding: 25px; border-radius: 16px; margin-bottom: 20px; box-shadow: var(--card-shadow); text-align: left;";

                // Đổi màu Đỏ/Xanh dựa vào kết quả làm bài
                let mauSac = dataCauHoi.ketQua ? "#10B981" : "#E11D48"; // Xanh lá nếu đúng, Đỏ nếu sai
                let iconKetQua = dataCauHoi.ketQua ? "✅ ĐÚNG" : "❌ SAI";

                theCauHoi.innerHTML = `
                    <h3 style="color: var(--text-main); margin-bottom: 15px; text-transform: uppercase;">
                        Câu ${cauId.replace('q', '')} 
                        <span style="float: right; color: ${mauSac}; font-size: 16px;">${iconKetQua}</span>
                    </h3>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 15px; font-size: 16px; color: var(--text-main);">
                        <p>Bạn chọn: <strong style="color: ${mauSac}; font-size: 18px;">${dataCauHoi.chon}</strong></p>
                        <p>Đáp án đúng: <strong style="color: #10B981; font-size: 18px;">${dataCauHoi.dung}</strong></p>
                    </div>

                    <div style="background: var(--bg-global); padding: 15px; border-radius: 12px; border-left: 4px solid var(--primary-purple);">
                        <h5 style="color: var(--primary-hover); margin-bottom: 5px;">Giải thích chi tiết:</h5>
                        <p style="color: var(--text-main); line-height: 1.6;">${loiGiai}</p>
                    </div>
                `;

                khungXemLai.appendChild(theCauHoi);
            }
        } else {
            khungXemLai.innerHTML = "<p>Không tìm thấy dữ liệu bài làm. Vui lòng thi lại!</p>";
        }
    }
