function GRS() { 
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
var ip = GRS() + "." + GRS() + "." + GRS() + "." + GRS();
console.log(ip);
var data = {};
        data.uname = 'nrajs';
        data.passwd = '1q2w3e';
        data.bid = ip;
        data.sid = fsid.get();
        socket.json.emit('login', data);
