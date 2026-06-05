// === ĐỒNG HỒ ĐẾM NGƯỢC ===
let total-seconds=90*60
const countdownElement=document.getElementById('countdown')

const timerInterval=setInterval(() => {
    let minutes=Math.floor(total-seconds/60);
    let seconds=total-seconds%60;

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