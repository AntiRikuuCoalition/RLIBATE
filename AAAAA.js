function GRS() { 
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
    if (parseInt(result) <= 100) {
    return result.replace(/^0+/, '');
  }
  return result;
}
var ip = GRS() + "." + GRS() + "." + GRS() + "." + GRS();
console.log(ip);
var data = {};
        data.uname = 'AAAAAAAAAAAA';
        data.passwd = '1q2w3e';
        data.bid = ip;
        data.sid = fsid.get();
        socket.json.emit('login', data);
