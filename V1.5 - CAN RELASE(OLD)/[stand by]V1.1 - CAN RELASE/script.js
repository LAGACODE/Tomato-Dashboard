// 時鐘與日期更新
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    // 民國日期轉換
    const year = now.getFullYear() - 1911;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('date').textContent = `${year}/${month}/${day}`;

    // 星期轉換
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('weekday').textContent = `星期${weekdays[now.getDay()]}`;
}

setInterval(updateTime, 1000);
updateTime();

// 輪播圖片
const images = ["images/photo1.jpg", "images/photo2.jpg", "images/photo3.jpg"];
let imgIndex = 0;
const imgElement = document.getElementById("slideshow");

function changeImage() {
    imgIndex = (imgIndex + 1) % images.length;
    imgElement.src = images[imgIndex];
}

setInterval(changeImage, 3000);

// 載入跑馬燈的文字
async function loadMarqueeText() {
    try {
        const response = await fetch('marquee.txt');  // 確保 'marquee.txt' 路徑正確
        if (!response.ok) throw new Error('無法讀取跑馬燈檔案');

        const marqueeText = await response.text();
        const lines = marqueeText.split('\n'); // 以換行符號分割每一行

        let displayText = ''; // 用來存儲需要顯示的跑馬燈內容

        // 遍歷每一行
        lines.forEach(line => {
            if (line.startsWith('SHOW:')) {
                // 只顯示 'SHOW:' 開頭的行
                displayText += line.substring(5) + ' '; // 去除 'SHOW:'，並將文字加到顯示文本中
            }
        });

        // 更新跑馬燈內容
        const marqueeElement = document.querySelector('.footer marquee');
        if (displayText.trim()) {
            marqueeElement.textContent = displayText.trim();
        } else {
            marqueeElement.textContent = '跑馬燈內容加載失敗，請檢查檔案內容。';
        }

    } catch (error) {
        console.error(error);
        document.querySelector('.footer marquee').textContent = '跑馬燈內容讀取失敗';
    }
}

loadMarqueeText();

// 抓取 JSON 資料
async function fetchData() {
    try {
        const response = await fetch('taipei_data.json');
        if (!response.ok) throw new Error('資料抓取失敗');

        const data = await response.json();
        const today = new Date();
        const todayStr = `${today.getFullYear() - 1911}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

        const todayData = data.find(item => item["交易日期"] === todayStr);
        if (todayData) {
            document.getElementById('today-date').textContent = todayData["交易日期"];
            document.getElementById('market-name').textContent = todayData["市場名稱"];
            document.getElementById('average-price').textContent = todayData["平均價"];
            document.getElementById('trade-volume').textContent = todayData["交易量"];
        } else {
            throw new Error('今日資料未找到');
        }
    } catch (error) {
        console.error(error);
        document.getElementById('error-message').classList.remove('hidden');
        document.querySelector('.main-content').classList.add('blur-background');
    }
}

fetchData();
setInterval(fetchData, 180000);  // 每 3 分鐘更新一次資料