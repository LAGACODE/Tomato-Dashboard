document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');
    const weekday = document.getElementById('weekday');
    const overlay = document.getElementById('chartOverlay');

    // 实时时间更新
    function updateTime() {
        const now = new Date();
        
        // 时钟格式 HH:MM:SS
        clock.textContent = now.toLocaleTimeString('zh-TW', { hour12: false });
        
        // 民国日期
        const year = now.getFullYear() - 1911;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        date.textContent = `民國${year}/${month}/${day}`;
        
        // 星期
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekday.textContent = `星期${weekdays[now.getDay()]}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // 获取数据
    fetch('taipei_data.json')
    .then(res => res.json())
    .then(data => {
        // 获取今日日期（格式：114.02.05）
        const today = new Date();
        const todayStr = `${today.getFullYear()-1911}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

        // 查找今日数据
        const todayData = data.find(item => item.交易日期 === todayStr);
        
        if (todayData) {
            document.getElementById('trade-date').textContent = todayData.交易日期;
            document.getElementById('avg-price').textContent = todayData.平均價.toFixed(1);
            document.getElementById('market-name').textContent = todayData.市場名稱;
            document.getElementById('trade-volume').textContent = todayData.交易量.toLocaleString();
        } else {
            overlay.style.display = 'flex';
        }

        // 绘制图表
        const ctx = document.getElementById('tradeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.交易日期),
                datasets: [{
                    label: '平均價',
                    data: data.map(d => d.平均價),
                    borderColor: '#3498db',
                    tension: 0.4
                }, {
                    label: '交易量',
                    data: data.map(d => d.交易量),
                    borderColor: '#e74c3c',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { text: '平均價', display: true }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { text: '交易量', display: true },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    })
    .catch(() => {
        overlay.style.display = 'flex';
    });
});