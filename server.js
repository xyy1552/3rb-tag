const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('.')); // لخدمة ملفات الموقع والـ APK

const DATA_FILE = path.join(__dirname, 'data.txt');

// دالة لقراءة ملف txt
function readData() {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8').trim().split('\n');
    return {
      downloads: parseInt(content[0]) || 0,
      status: content[1] ? content[1].trim().toLowerCase() : 'online'
    };
  } catch (err) {
    return { downloads: 0, status: 'online' };
  }
}

// API لجلب البيانات الحالية
app.get('/api/status', (req, res) => {
  res.json(readData());
});

// API للتحميل ورفع العداد بـ 1
app.get('/api/download', (req, res) => {
  const data = readData();

  // التحقق هل السيرفر شغال؟
  if (data.status !== 'online') {
    return res.status(403).json({ 
      success: false, 
      message: 'السيرفر حالياً مغلق أو تحت الصيانة، لا يمكن التحميل!' 
    });
  }

  // زيادة التحميلات وتحديث ملف txt
  data.downloads += 1;
  fs.writeFileSync(DATA_FILE, `${data.downloads}\n${data.status}`);

  // تنزيل ملف اللعبة
  res.download(path.join(__dirname, '3rb tag.apk'));
});

app.listen(3000, () => {
  console.log('⚡ السيرفر شغال على البورت 3000');
});
