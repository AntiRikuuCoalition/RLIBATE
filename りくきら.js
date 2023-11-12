        var data = {};
        data.uname = '🍧璃空🍧キラー';
        data.passwd = 'PAVbUcnWU12JjQPs';
        data.bid = "IP抜かせません";
        data.sid = fsid.get();
        socket.json.emit('login', data);
