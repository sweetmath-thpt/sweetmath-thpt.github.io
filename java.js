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

            // CẤU TRÚC ĐÁP ÁN MỚI CHIA THEO 3 PHẦN
            const nganHangDapAn = {
                'lambai.html': {
                    'tenDe': 'ĐỀ THI THỬ NGHIỆM',
                    'dapAn': {
                        'phan1': { 'p1_q1': 'D' }, // Phần I: Mỗi câu đúng 0,25 đ
                        'phan2': { 
                            // Phần II: 1 câu lớn chứa 4 ý a,b,c,d
                            'p2_q2': { 'a': 'S', 'b': 'D', 'c': 'D', 'd': 'S' } 
                        },
                        'phan3': { 'p3_q3': '2' } // Phần III: Mỗi câu đúng 0,5 đ
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
                        let inputName = `${q}_${y}`; // Cú pháp tìm: p2_q2_a
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
    // 8. TỰ ĐỘNG DỰNG GIAO DIỆN XEM LẠI BÀI LÀM (CẬP NHẬT CHIA 3 PHẦN)
    // =========================================================================
    const khungXemLai = document.getElementById('khung-xem-lai');

    if (khungXemLai) {
        const khoGiaiThich = {
            'lambai.html': {
                'p1_q1': 'Tháp Tokyo nằm ở Nhật Bản (châu Á), trong khi Tháp Eiffel, Pisa, Big Ben đều nằm ở châu Âu.',
                'p2_q2': 'Ý a Sai (Georg Cantor là người Đức). Ý b Đúng (Định lý Pythagoras). Ý c Đúng (Alan Turing được xem là cha đẻ KHMT). Ý d Sai (Descartes phát minh hệ tọa độ Descartes).',
                'p3_q3': 'Vì 1 + 1 = 2 (Phép cộng cơ bản).'
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
