// Đảm bảo toàn bộ HTML đã tải xong thì Javascript mới được phép chạy
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
            this.classList.toggle('is-marked');
            
            const targetId = this.getAttribute('data-target');
            if(targetId) {
                const paletteElement = document.getElementById(targetId);
                if (paletteElement) {
                    paletteElement.classList.toggle('is-marked');
                }
            }
        });
    });

    // --- Khi học sinh CHỌN ĐÁP ÁN (RADIO HOẶC ĐIỀN TỪ) ---
    answerInputs.forEach(input => {
        const capNhatMauBang = function() {
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

            const targetId = this.getAttribute('data-target');
            if(!targetId) return; 

            const paletteElement = document.getElementById(targetId);
            if (paletteElement) {
                if (this.type === 'radio') {
                    if (this.checked) {
                        paletteElement.classList.add('is-answered');
                    }
                } else {
                    if (this.value.trim() !== "") {
                        paletteElement.classList.add('is-answered');
                    } else {
                        paletteElement.classList.remove('is-answered');
                    }
                }
            }
        };

        input.addEventListener('change', capNhatMauBang);
        if(input.type === 'radio') {
            input.addEventListener('click', capNhatMauBang); 
        }
        if(input.type === 'text') {
            input.addEventListener('input', capNhatMauBang); 
        }
    });

    // =========================================================================
    // 5. TÍNH NĂNG "BẢNG TRƯỢT TIKTOK" ĐỘC QUYỀN CHO MOBILE
    // =========================================================================
    const btnMobile = document.getElementById('btn-mobile-palette');
    const paletteBox = document.getElementById('palette');

    if (btnMobile && paletteBox) {
        btnMobile.addEventListener('click', function(event) {
            event.stopPropagation(); 
            paletteBox.classList.toggle('show-mobile');
            
            if (paletteBox.classList.contains('show-mobile')) {
                btnMobile.innerHTML = '❌ Đóng bảng';
                btnMobile.style.backgroundColor = 'var(--accent-candy, #FF9A9E)'; 
            } else {
                btnMobile.innerHTML = '📋 Bảng câu hỏi';
                btnMobile.style.backgroundColor = 'var(--primary-purple, #A78BFA)'; 
            }
        });

        paletteBox.addEventListener('click', function(event) {
            const mucDuocChon = event.target.closest('li') || event.target.closest('a') || event.target.closest('button');

            if (mucDuocChon) {
                paletteBox.classList.remove('show-mobile');
                btnMobile.innerHTML = '📋 Bảng câu hỏi';
                btnMobile.style.backgroundColor = 'var(--primary-purple, #A78BFA)';
            }
        });

        document.addEventListener('click', function(event) {
            if (paletteBox.classList.contains('show-mobile')) {
                const clickTrongBang = paletteBox.contains(event.target);
                const clickVaoNutNoi = btnMobile.contains(event.target);

                if (!clickTrongBang && !clickVaoNutNoi) {
                    paletteBox.classList.remove('show-mobile');
                    btnMobile.innerHTML = '📋 Bảng câu hỏi';
                    btnMobile.style.backgroundColor = 'var(--primary-purple, #A78BFA)';
                }
            }
        });
    }

    // =========================================================================
    // 6. TỰ ĐỘNG CHẤM ĐIỂM THEO QUY CHẾ MỚI (CẬP NHẬT)
    // =========================================================================
    const btnXacNhanNop = document.querySelector('#overlay-nopbai .btn-confirm');

    if (btnXacNhanNop) {
        btnXacNhanNop.addEventListener('click', function(event) {
            event.preventDefault(); 

            // CẤU TRÚC ĐÁP ÁN MỚI CHIA THEO 3 PHẦN ĐÃ CẬP NHẬT
            const nganHangDapAn = {
                'lambai.html': {
                    'tenDe': 'ĐỀ THI THỬ NGHIỆM XÁC SUẤT',
                    'dapAn': {
                        // Phần I: Trắc nghiệm nhiều lựa chọn (6 câu)
                        'phan1': { 
                            'p1_q1': 'D', 
                            'p1_q2': 'A', 
                            'p1_q3': 'C', 
                            'p1_q4': 'B', 
                            'p1_q5': 'D', 
                            'p1_q6': 'A' 
                        },
                        // Phần II: Trắc nghiệm đúng/sai (2 câu lớn, mỗi câu 4 ý)
                        'phan2': { 
                            'p2_q1': { 'a': 'S', 'b': 'S', 'c': 'D', 'd': 'S' },
                            'p2_q2': { 'a': 'S', 'b': 'D', 'c': 'D', 'd': 'D' } 
                        },
                        // Phần III: Trắc nghiệm trả lời ngắn (3 câu)
                        'phan3': { 
                            'p3_q1': '0,88', 
                            'p3_q2': '0,5', 
                            'p3_q3': '0,94' 
                        } 
                    }
                }
            };

            const tenFileHienTai = window.location.pathname.split('/').pop() || 'lambai.html';

            if (!nganHangDapAn[tenFileHienTai]) {
                alert("Hệ thống chưa cập nhật đáp án cho file đề thi này!");
                return;
            }

            const thongTinDeThi = nganHangDapAn[tenFileHienTai];
            const boDapAn = thongTinDeThi.dapAn;

            let diemSo = 0;
            let soQuyetDinhDung = 0; // Đếm tổng số lựa chọn/điền đúng của thí sinh
            let tongSoQuyetDinh = 0; // Tổng số lựa chọn tối đa
            let chiTietBaiLam = { phan1: {}, phan2: {}, phan3: {} };

            // CHẤM ĐIỂM PHẦN I (0.25đ / câu)
            if (boDapAn.phan1) {
                for (let q in boDapAn.phan1) {
                    tongSoQuyetDinh++;
                    let dapAnDung = boDapAn.phan1[q];
                    let userRadio = document.querySelector(`input[name="${q}"]:checked`);
                    let luaChon = userRadio ? userRadio.value : "Chưa làm";
                    let ketQua = (luaChon === dapAnDung);

                    if (ketQua) {
                        diemSo += 0.25;
                        soQuyetDinhDung++;
                    }
                    chiTietBaiLam.phan1[q] = { chon: luaChon, dung: dapAnDung, ketQua: ketQua };
                }
            }

            // CHẤM ĐIỂM PHẦN II (1 ý=0.1đ | 2 ý=0.25đ | 3 ý=0.5đ | 4 ý=1đ)
            if (boDapAn.phan2) {
                for (let q in boDapAn.phan2) {
                    let yDung = boDapAn.phan2[q];
                    let soYChinhXac = 0;
                    chiTietBaiLam.phan2[q] = { y: {}, soYdung: 0, diem: 0 };

                    for (let y in yDung) {
                        tongSoQuyetDinh++; // Mỗi ý được xem như 1 quyết định độc lập
                        let dapAnDung = yDung[y];
                        let inputName = `${q}_${y}`; 
                        let userRadio = document.querySelector(`input[name="${inputName}"]:checked`);
                        let luaChon = userRadio ? userRadio.value : "Chưa làm";
                        let ketQua = (luaChon === dapAnDung);

                        if (ketQua) {
                            soYChinhXac++;
                            soQuyetDinhDung++;
                        }
                        chiTietBaiLam.phan2[q].y[y] = { chon: luaChon, dung: dapAnDung, ketQua: ketQua };
                    }

                    // Quy tắc cộng điểm lũy tiến Phần II
                    let diemCauNay = 0;
                    if (soYChinhXac === 1) diemCauNay = 0.1;
                    else if (soYChinhXac === 2) diemCauNay = 0.25;
                    else if (soYChinhXac === 3) diemCauNay = 0.5;
                    else if (soYChinhXac === 4) diemCauNay = 1.0;

                    diemSo += diemCauNay;
                    chiTietBaiLam.phan2[q].soYdung = soYChinhXac;
                    chiTietBaiLam.phan2[q].diem = diemCauNay;
                }
            }

            // CHẤM ĐIỂM PHẦN III (0.5đ / câu)
            if (boDapAn.phan3) {
                for (let q in boDapAn.phan3) {
                    tongSoQuyetDinh++;
                    let dapAnDung = boDapAn.phan3[q].toString();
                    let userText = document.querySelector(`input[name="${q}"]`);
                    let luaChon = (userText && userText.value.trim() !== "") ? userText.value.trim() : "Chưa làm";
                    let ketQua = (luaChon === dapAnDung);

                    if (ketQua) {
                        diemSo += 0.5;
                        soQuyetDinhDung++;
                    }
                    chiTietBaiLam.phan3[q] = { chon: luaChon, dung: dapAnDung, ketQua: ketQua };
                }
            }

            diemSo = parseFloat(diemSo.toFixed(2));
            localStorage.setItem('diemHocSinh', diemSo);
            localStorage.setItem('soCauDung', soQuyetDinhDung);
            localStorage.setItem('tongSoCau', tongSoQuyetDinh);
            localStorage.setItem('tenDeThi', thongTinDeThi.tenDe);
            localStorage.setItem('tenFileDeThi', tenFileHienTai); 
            localStorage.setItem('chiTietBaiLam', JSON.stringify(chiTietBaiLam));

            window.location.href = this.getAttribute('href') || "ketqua.html";
        });
    }

    // =========================================================================
    // 7. HIỂN THỊ TRÊN TRANG KẾT QUẢ (ketqua.html)
    // =========================================================================
    const diemHienThi = document.getElementById('diem-so');
    const soCauHienThi = document.getElementById('so-cau-dung'); 
    const tenDeHienThi = document.getElementById('ten-de-thi');

    if (diemHienThi && soCauHienThi) {
        const diem = localStorage.getItem('diemHocSinh') || 0;
        const dung = localStorage.getItem('soCauDung') || 0;
        const tong = localStorage.getItem('tongSoCau') || 0;
        const tenDe = localStorage.getItem('tenDeThi') || 'KẾT QUẢ BÀI THI';

        if (tenDeHienThi) tenDeHienThi.textContent = tenDe;
        diemHienThi.textContent = diem;
        soCauHienThi.textContent = dung + " / " + tong + " Lựa chọn đúng";
    }

    // =========================================================================
    // 8. TỰ ĐỘNG DỰNG GIAO DIỆN XEM LẠI BÀI LÀM (CẬP NHẬT CHIA 3 PHẦN & LỜI GIẢI MỚI)
    // =========================================================================
    const khungXemLai = document.getElementById('khung-xem-lai');

    if (khungXemLai) {
        const khoGiaiThich = {
            'lambai.html': {
                // Giải thích Phần 1
                'p1_q1': 'Vì A và B là hai biến cố xung khắc nên xác suất hợp: P(A ∪ B) = P(A) + P(B) = 0,4 + 0,3 = 0,7.',
                'p1_q2': 'Vì A và B là hai biến cố độc lập nên xác suất giao: P(A ∩ B) = P(A) × P(B) = 0,3 × 0,4 = 0,12.',
                'p1_q3': 'Theo định nghĩa, hai biến cố xung khắc là hai biến cố không bao giờ xảy ra đồng thời. Do đó phần giao của chúng bằng tập rỗng (A ∩ B = ∅).',
                'p1_q4': 'Biến cố A và B là hoàn toàn độc lập với nhau (kết quả gieo lần 1 không ảnh hưởng đến lần 2). Tuy nhiên, chúng có thể cùng xảy ra (gieo ra 2 mặt 6 chấm liên tiếp) nên không thể là hai biến cố xung khắc. Do đó khẳng định B là sai.',
                'p1_q5': 'Xác suất lấy được viên bi đỏ ở mỗi hộp đều là 1/3. Vì việc chọn bi từ 3 hộp là độc lập nhau nên xác suất để cả 3 bi đều màu đỏ là: (1/3) × (1/3) × (1/3) = 1/27.',
                'p1_q6': 'Ta có công thức cộng: P(A ∪ B) = P(A) + P(B) - P(A ∩ B) ⇔ 0,8 = 0,5 + 0,6 - P(A ∩ B) ⇒ P(A ∩ B) = 0,3.<br>Mặt khác, P(A) × P(B) = 0,5 × 0,6 = 0,3. Vì P(A ∩ B) = P(A) × P(B) nên A và B là hai biến cố độc lập.',
                
                // Giải thích Phần 2
                'p2_q1': 'Tỉ lệ nhân viên nữ là 0,45; tỉ lệ nhân viên nam là 1 - 0,45 = 0,55.<br>Xác suất chọn nhân viên nữ và mua BHNT là: 0,45 × 0,07 = 0,0315.<br>Xác suất chọn nhân viên nam và mua BHNT là: 0,55 × 0,05 = 0,0275.<br>- <b>Ý a Sai:</b> Xác suất chọn là nam phải bằng 0,55.<br>- <b>Ý b Sai:</b> Xác suất nhân viên có mua BHNT = 0,0315 + 0,0275 = 0,059 (không phải 0,061).<br>- <b>Ý c Đúng:</b> Theo công thức xác suất có điều kiện: P(Nữ | Mua BHNT) = 0,0315 / 0,059 = 315 / 590 = 63 / 118.<br>- <b>Ý d Sai:</b> Vì 0,0275 < 0,0315 nên xác suất nhân viên đó là nam thấp hơn là nữ.',
                'p2_q2': 'Gọi biến cố H1, H2 là bóng 1 và 2 bị hỏng; S1, S2 là bóng 1 và 2 còn sáng.<br>Theo đề: P(H1) = 0,2 ⇒ P(S1) = 0,8 và P(H2) = 0,5 ⇒ P(S2) = 0,5.<br>- <b>Ý a Sai:</b> P(cả 2 hỏng) = P(H1) × P(H2) = 0,2 × 0,5 = 0,1.<br>- <b>Ý b Đúng:</b> P(cả 2 sáng) = P(S1) × P(S2) = 0,8 × 0,5 = 0,4.<br>- <b>Ý c Đúng:</b> P(chỉ 1 sáng) = P(S1)×P(H2) + P(H1)×P(S2) = (0,8 × 0,5) + (0,2 × 0,5) = 0,4 + 0,1 = 0,5.<br>- <b>Ý d Đúng:</b> Xác suất làm được bài (ít nhất 1 bóng sáng) = 1 - P(cả 2 hỏng) = 1 - 0,1 = 0,9 (tức 90%).',
                
                // Giải thích Phần 3
                'p3_q1': 'Tổng số học sinh là 45. Số học sinh không giỏi môn nào là 12 ⇒ Số học sinh có học lực giỏi ít nhất 1 môn là 45 - 12 = 33.<br>Số học sinh giỏi cả 2 môn (Toán và Văn) là: (30 + 25) - 33 = 22.<br>Xác suất chọn được học sinh giỏi Toán biết rằng em đó giỏi Văn = n(Giỏi cả 2 môn) / n(Giỏi Văn) = 22 / 25 = 0,88.',
                'p3_q2': 'Trong 45 quả cầu có 23 quả đánh số lẻ và 22 quả đánh số chẵn. Lấy ngẫu nhiên 3 quả, tổng số phần tử không gian mẫu = C(3, 45) = 14190.<br>Tổng 3 số là số lẻ trong 2 trường hợp: (Cả 3 quả đều lẻ) hoặc (1 quả lẻ, 2 quả chẵn).<br>Số cách lấy thuận lợi = C(3, 23) + [C(1, 23) × C(2, 22)] = 1771 + 5313 = 7084.<br>Xác suất = 7084 / 14190 ≈ 0,499... Làm tròn đến hàng phần mười được kết quả là 0,5.',
                'p3_q3': 'Xác suất bắn trượt của xạ thủ 1 là: 1 - 0,8 = 0,2.<br>Xác suất bắn trượt của xạ thủ 2 là: 1 - 0,7 = 0,3.<br>Xác suất để cả 2 cùng bắn trượt (biến cố đối) là: 0,2 × 0,3 = 0,06.<br>Vậy xác suất có ít nhất một người bắn trúng bia là: 1 - 0,06 = 0,94.'
            }
        };

        const chiTietBaiLamRaw = localStorage.getItem('chiTietBaiLam');
        const chiTietBaiLam = chiTietBaiLamRaw ? JSON.parse(chiTietBaiLamRaw) : null;
        const tenFileDeThi = localStorage.getItem('tenFileDeThi') || 'lambai.html'; 
        const tenDeThi = localStorage.getItem('tenDeThi') || 'Bài thi thử thiết kế Demo';

        const xlTenDe = document.getElementById('xl-ten-de');
        if (xlTenDe) xlTenDe.textContent = tenDeThi;

        if (chiTietBaiLam && khoGiaiThich[tenFileDeThi]) {
            const boGiaiThich = khoGiaiThich[tenFileDeThi];
            khungXemLai.innerHTML = ''; 

            // Hàm tạo block câu hỏi đồng bộ thiết kế cũ của bạn
            function taoKhungCauHoi(title, content, mauTieuDe, colorIcon, iconText, loiGiai) {
                let theCauHoi = document.createElement('div');
                theCauHoi.style.cssText = "background: var(--white); padding: 25px; border-radius: 16px; margin-bottom: 20px; box-shadow: var(--card-shadow); text-align: left;";
                theCauHoi.innerHTML = `
                    <h3 style="color: var(--text-main); margin-bottom: 15px; text-transform: uppercase; font-size: 20px;">
                        ${title}
                        <span style="float: right; color: ${colorIcon}; font-size: 18px; font-weight: bold;">${iconText}</span>
                    </h3>
                    ${content}
                    <div style="background: var(--bg-global); padding: 15px; border-radius: 12px; border-left: 4px solid var(--primary-purple); margin-top: 15px;">
                        <h5 style="color: var(--primary-hover); margin-top: 0; margin-bottom: 5px; font-size: 18px;">Giải thích chi tiết:</h5>
                        <p style="color: var(--text-main); line-height: 1.6; font-size: 16px; margin-bottom: 0;">${loiGiai}</p>
                    </div>
                `;
                return theCauHoi;
            }

            // --- RENDER PHẦN 1 ---
            if (chiTietBaiLam.phan1 && Object.keys(chiTietBaiLam.phan1).length > 0) {
                khungXemLai.innerHTML += `<h3 style="color: var(--primary-purple); margin: 30px 0 15px; text-align: left; border-bottom: 2px dashed #ccc; padding-bottom: 10px;">PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN</h3>`;
                for (let q in chiTietBaiLam.phan1) {
                    let data = chiTietBaiLam.phan1[q];
                    let loiGiai = boGiaiThich[q] || "Chưa có lời giải.";
                    let title = `Câu ${q.replace('p1_q', '')}`;
                    let mauSac = data.ketQua ? "#10B981" : "#E11D48";
                    let iconKetQua = data.ketQua ? "✅ ĐÚNG (+0.25đ)" : "❌ SAI";

                    let content = `
                        <div style="display: flex; gap: 20px; font-size: 18px; color: var(--text-main);">
                            <p>Bạn chọn: <strong style="color: ${mauSac};">${data.chon}</strong></p>
                            <p>Đáp án đúng: <strong style="color: #10B981;">${data.dung}</strong></p>
                        </div>
                    `;
                    khungXemLai.appendChild(taoKhungCauHoi(title, content, mauSac, mauSac, iconKetQua, loiGiai));
                }
            }

            // --- RENDER PHẦN 2 ---
            if (chiTietBaiLam.phan2 && Object.keys(chiTietBaiLam.phan2).length > 0) {
                khungXemLai.innerHTML += `<h3 style="color: var(--primary-purple); margin: 30px 0 15px; text-align: left; border-bottom: 2px dashed #ccc; padding-bottom: 10px;">PHẦN II. TRẮC NGHIỆM ĐÚNG/SAI</h3>`;
                for (let q in chiTietBaiLam.phan2) {
                    let data = chiTietBaiLam.phan2[q];
                    let loiGiai = boGiaiThich[q] || "Chưa có lời giải.";
                    let title = `Câu ${q.replace('p2_q', '')}`;

                    // Màu sắc tùy biến theo mức độ điểm đạt được
                    let mauDiem = data.diem === 1.0 ? "#10B981" : (data.diem > 0 ? "#F59E0B" : "#E11D48");
                    let iconKetQua = data.diem === 1.0 ? "✅ PERFECT (+1.0đ)" : `⭐ ĐIỂM: ${data.diem}`;

                    let contentHtml = `<div>`;
                    for (let y in data.y) {
                        let dataY = data.y[y];
                        let yMau = dataY.ketQua ? "#10B981" : "#E11D48";
                        let yIcon = dataY.ketQua ? "✅" : "❌";
                        contentHtml += `
                            <div style="padding: 10px 15px; background: #f8fafc; margin-bottom: 8px; border-radius: 8px; font-size: 16px; color: var(--text-main);">
                                <span style="font-weight: bold; margin-right: 10px; text-transform: uppercase;">Ý ${y}:</span>
                                Bạn chọn: <strong style="color: ${yMau}; margin-right: 15px;">${dataY.chon}</strong> | 
                                Đáp án đúng: <strong style="color: #10B981; margin-left: 10px; margin-right: 10px;">${dataY.dung}</strong> ${yIcon}
                            </div>
                        `;
                    }
                    contentHtml += `</div>`;

                    khungXemLai.appendChild(taoKhungCauHoi(title, contentHtml, mauDiem, mauDiem, iconKetQua, loiGiai));
                }
            }

            // --- RENDER PHẦN 3 ---
            if (chiTietBaiLam.phan3 && Object.keys(chiTietBaiLam.phan3).length > 0) {
                khungXemLai.innerHTML += `<h3 style="color: var(--primary-purple); margin: 30px 0 15px; text-align: left; border-bottom: 2px dashed #ccc; padding-bottom: 10px;">PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN</h3>`;
                for (let q in chiTietBaiLam.phan3) {
                    let data = chiTietBaiLam.phan3[q];
                    let loiGiai = boGiaiThich[q] || "Chưa có lời giải.";
                    let title = `Câu ${q.replace('p3_q', '')}`;
                    let mauSac = data.ketQua ? "#10B981" : "#E11D48";
                    let iconKetQua = data.ketQua ? "✅ ĐÚNG (+0.5đ)" : "❌ SAI";

                    let content = `
                        <div style="display: flex; gap: 20px; font-size: 18px; color: var(--text-main);">
                            <p>Bạn điền: <strong style="color: ${mauSac};">${data.chon}</strong></p>
                            <p>Đáp án đúng: <strong style="color: #10B981;">${data.dung}</strong></p>
                        </div>
                    `;
                    khungXemLai.appendChild(taoKhungCauHoi(title, content, mauSac, mauSac, iconKetQua, loiGiai));
                }
            }
        } else {
            khungXemLai.innerHTML = "<div style='text-align: center; padding: 40px; color: var(--text-muted);'>Không tìm thấy dữ liệu bài làm hợp lệ trong bộ nhớ. Vui lòng quay lại làm bài từ đầu!</div>";
        }
    }
});
