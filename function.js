// function 1 and 2 for gangue

return { payload: msg.payload.suhu};
return { payload: msg.payload.kelembapan};

// function 3 for saving log to database

let suhu = msg.payload.suhu;
let kelembapan = msg.payload.kelembapan;

msg.topic = "INSERT INTO tbl_data(suhu, kelembapan)values(?, ?)";
msg.payload = [suhu, kelembapan];

return msg;

// function 4 for saving log to s3 bucket 

msg.Bucket = "";
msg.Key = `logs/"${Date.now()}.json`;
msg.body = JSON.stringify({
  waktu: new Date().toLocaleString("sv-SE", {timeZone: Asia/Jakarta}),
  suhu: msg.payload?.suhu || 0,
  kelembapan: msg.payload?.kelembapan || 0
},null, 2);
msg.ContentType = "application/json";
msg.payload = msg.body;

return msg;

// function 5 for saving logs to efs

msg.filename = `/mnt/efs/logs/${Date.now()}.json`;
msg.payload = JSON.stringify({
  waktu: new Date().toLocaleString("sv-SE", {timeZone: Asia/Jakarta}),
  suhu: msg.payload?.suhu || 0,
  kelembapan: msg.payload?.kelembapan || 0
},null, 2);

return msg;

// function 6 for redis 

msg.payload = {
  waktu: new Date().toLocaleString("sv-SE", {timeZone: Asia/Jakarta}),
  suhu: msg.payload?.suhu || 0,
  kelembapan: msg.payload?.kelembapan || 0
};
msg.topic = "sensor:" + Date.now();

return msg;
