        var data = {};
        data.uname = 'AAAAAAAAAAAA';
        data.passwd = '1q2w3e';
        data.bid = "IP抜かせません";
        data.sid = fsid.get();
        socket.json.emit('login', data);
