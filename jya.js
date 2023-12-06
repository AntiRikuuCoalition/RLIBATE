function change_disp_by_user_or_guest(data) {
	clear_global();
	if (data.uid) {
		uid = data.uid;
		var cmd = data.cmd;
		if (uid == "guest") {}
		$('#b_open_login').hide();
		$('#li_logout').show();
		$('#b_open_create_user').hide();
		$('#div_login').hide();
		$('#b_open_notice').show();
		$('#li_change_photo').show();
		$('#li_change_passwd').show();
		$('#create_new_user').hide();
		$('.b_show_create_room').show();
		var uid_data = {};
		uid_data[data.uid] = [data.uname, data.imgs[0], data.status];
		add_user_store(uid_data);
		socket.json.emit('get_friend_list');
		if (cmd == "login" || cmd == "create_user") {
			fsid.set(data.sid, data.keep_login)
		}
		user_photo(data.imgs, data.uname, data.character_name);
		if (data.created) {
			show_photo_dialog()
		}
	} else {
		data.uname = "ゲスト";
		uid = "guest";
		$('#b_open_login').show();
		$('#li_logout').hide();
		$('#b_open_create_user').show();
		$('#b_open_notice').hide();
		$('#li_change_photo').hide();
		$('#li_change_passwd').hide();
		$('#create_new_user').show();
		$('.b_show_create_room').hide();
		fsid.del();
		user_photo(data.imgs, data.uname, data.character_name)
	}
	if (_MY_SP_ == 1 && (uid == "guest" || uid == "")) {
		show_notice({
			msg: "𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙉𝙀𝙏𝙍𝙊𝙊𝙈 𝘿𝙖𝙧𝙠 𝙫𝙚𝙧𝙨𝙞𝙤𝙣, 𝙜𝙪𝙚𝙨𝙩."
		}, 4000)
	} else {
		show_notice({
			msg: "𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙉𝙀𝙏𝙍𝙊𝙊𝙈 𝘿𝙖𝙧𝙠 𝙫𝙚𝙧𝙨𝙞𝙤𝙣, " + data.uname + " ."
		})
	}
	get_page();
	get_list(selected_category, searched_room_name, "")
}
function date_f(date) {
    var that = new Date(date);
    var now = new Date();
    var that_y = that.getFullYear();
    var that_m = that.getMonth() + 1;
    var that_d = that.getDate();
    var that_h = that.getHours();
    var that_mt = that.getMinutes();
    var that_s = that.getSeconds() + that.getMilliseconds() / 1000;
    var now_y = now.getFullYear();
    var now_m = now.getMonth() + 1;
    var now_d = now.getDate();

    var datetime = '';

    if (that_y != now_y) {
        datetime += that_y + '年';
    }

    if (that_m != now_m || that_d != now_d) {
        datetime += that_m + '月' + that_d + '日';
    }

    if (that_h < 10) {
        that_h = '0' + that_h;
    }

    if (that_mt < 10) {
        that_mt = '0' + that_mt;
    }

    if (that_s < 10) {
        that_s = '0' + that_s.toFixed(2); // 小数点第二位まで表示
    } else {
        that_s = that_s.toFixed(2);
    }

    datetime += ' ' + that_h + '時' + that_mt + '分' + that_s + '秒';

    return datetime;
}
const cssCode = `
body#body {
	font-size:12px;
	color:#333333;
	line-height:1.7em;
	background: linear-gradient(to bottom, black, gray);
	padding:0;
	margin:0;
	overflow:hidden;

}
#d_received_msg {
	bottom:150px;
	top:auto;
	width:360px;
	height:85px;
}
#d_received_msg .comd {
	height:13px;
	overflow:hidden;
	empty-cells:show;
	display:inline-block;
	width: 240px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
}

#room_listb .on {
	background: none repeat scroll 0 0 #555555;
	border-radius: 3px;
	color: #fff;
	font-weight: bold;
}

#room_listb .cat2:hover {
	background: none repeat scroll 0 0 eeeeee;
	border-radius: 3px;
	color: #333;
	cursor:pointer;
}
.btn, .btn:active {
	height:auto;
	min-height:inherit;
	width:auto;
	font-size:10px;
	border-radius:0;
	padding:0px 5px;
	background:#333333;
	border:none;
	box-shadow:0 0px 1px rgba(0, 0, 0, 0.3);
	text-shadow:none;
	border:none;
	color:#fff;
	font: 12px/1.231 Meiryo, "メイリオ", 'ＭＳ Ｐゴシック', verdana, arial, sans-serif;
	border-radius:1px;
}
.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar {
	background:#a5a5a5;
}
.mCSB_scrollTools .mCSB_draggerRail {
	background:#888888;
}
#body .mCSB_scrollTools_onDrag .mCSB_dragger_onDrag .mCSB_dragger_bar {
	background:#a5a5a5;
}
.btn:hover {
	background:#a5a5a5;
	color:#fff;
}
#room_listb .cat2:hover {
	background: none repeat scroll 0 0 #dbdbdb;
	border-radius: 3px;
	color: #333;
	cursor:pointer;
}
#room_listb .cat1 {
	font-weight:bold;
	color:#000000;
	line-height:2em;
	margin-top:6px;
}
li.now {
	border-left:3px solid #606060;
}
#comment {
	border-color:#e7e7e7;
	border-width:2px;
	margin-left:-1%;
	float:right;
	width:86%;
}
.you img.user {
	border:2px solid #797979;
}
img.selected {
	border: 3px solid #797979;
}
.dialog .h b, .dialog_small .h b {
	float:left;
	padding-left:10px;
	color:#000000;
}
.comd a {
	color:#818181;
	-moz-opacity:1.00;
	opacity:1.00;
	filter: alpha(opacity=100);
	transition: opacity 100ms linear 50ms;
}
.comd a:hover {
	color:#818181;
	-moz-opacity:0.50;
	opacity:0.50;
	filter: alpha(opacity=50);
	transition: opacity 100ms linear 50ms;
}
`;
const styleElement = document.createElement('style');
styleElement.innerHTML = cssCode;
document.head.appendChild(styleElement);
function show_msg(room_id, res, ini_flag, target, nowHeight) {
	$('.nonroom', $('#body')).each(function () {
		$(this).show()
	});
	$('#d_received_msg').hide();
	if (res.length == 0) {
		$('#prev_page').hide();
		$('#next_page').hide();
		$_view.html('');
		last_msg_seq[room_id] = 0;
		$('#page_no').html('1ページ目');
		disp_page = 1;
		m_hide();
		if (google_analytics) {
			var url = "/" + room_id + "/";
			ga('send', 'pageview', url)
		}
		if (room_id) {
			var mode = 1;
			pc_mode(mode)
		} else {
			var mode = 0;
			pc_mode(mode)
		}
		return
	}
	var html = "";
	var last_id = "";
	var last_seq = 0;
	for (var i = 0; i < res.length; i++) {
		if (res[i]["comment"] != undefined) {
			data = res[i];
			if (data.uname == '') {
				name = 'ゲスト'
			} else {
				name = data.uname;
				if (data.character_name) {
					name = data.character_name + '<span class="at_uname">@' + name + '</span>'
				}
				var uid_data = {};
				uid_data[data.uid] = [data.uname, data.img_no];
				add_user_store(uid_data)
			}
			if (data.uid == "" || data.uid == "guest" || data.uid == undefined) {
				data.img_no = 0;
				var img = 'guest'
			} else {
				var img = data.uid
			}
			if (target == 1) {
				var id_head = "oc"
			} else {
				var id_head = "c"
			}
			if (data.img) {
				var file = data.img;
				var imgdata = '<br><img class="click_img" src="/img/tmp/' + room_id + '_' + data["seq"] + '.jpg" >'
			} else {
				var imgdata = ""
			}
			var is_aa = '';
			if (data.comment.indexOf('　 ') !== -1) {
				is_aa = ' is_aa'
			}
			var ip = data.bid;
			var u_id = data.uid;
			if(ip == "122.131.30.0"){
					show_notice({
			msg: "注意!!この部屋にはスキビティのガキがいます!!"
		}, 1700)
				}
			html += '<div id="' + id_head + data["seq"] + '" class="comment clearfix" >';
			html += '<div class="l">' + img_users_pict(data.uid, data.img_no) + '</div>';
			html += '<div class="r">';
			html += '<div class="comment_head"><span class="m_no">' + data["seq"] + '</span><span class="m_uname">' + name + '</span><span class="m_time">' + date_f(data.time) + '</span><span class="at_uname">　 ' + ip + '</span><span class="m_time">　 ' + u_id + '</div>';
			html += '<div class="comd' + is_aa + '">' + comvert_msg(data.comment) + imgdata + '</div>';
			html += '</div>';
			html += '</div>';
			last_id = 'c' + data["seq"];
			last_seq = data["seq"] - 0
		}
	}
	if (target == 1) {
		$('#d_msg_one div.h').html('<div class="h clearfix ipop_title"><small class="link_pankuzu">≫' + data["seq"] + '</small><div class="d_close"><span class="close" id="close_d_msg_one">&#12288;×&#12288;</span></div></div>');
		$('#close_d_msg_one').unbind(_E.clickd);
		$('#close_d_msg_one').bind(_E.clickd, function (e) {
			e.preventDefault();
			$('#d_msg_one').hide();
			sp_d_hide()
		});
		$('#d_msg_one').show();
		$('#ul_msg_one').html(html);
		m_hide();
		return
	}
	var page = get_parameter(1);
	if (!page) {
		last_msg_seq[room_id] = last_seq
	}
	var room_last_seq = last_msg_seq[room_id];
	var this_last_seq = res[(res.length - 1)].seq;
	if (ini_flag == 1 || ini_flag == 2) {
		if (res[0]['seq'] <= 1) {
			$('#prev_page').hide();
			$('#totop2').hide()
		} else {
			$('#prev_page').show();
			$('#totop2').show()
		}
		if ((!room_last_seq) || this_last_seq < room_last_seq) {
			$('#next_page').show();
			$('#tobottom2').show()
		} else {
			$('#next_page').hide();
			$('#tobottom2').hide()
		}
	} else {
		if (last_seq % msg_limit == 0) {
			$('#next_page').show();
			$('#tobottom2').show();
			to_bottom('div_view', 0)
		}
	}
	if (ini_flag == 1) {
		$_view.html(html);
		var page = which_page(last_seq);
		$('#page_no').html(page + 'ページ目');
		if (room_id) {
			var mode = 1;
			pc_mode(mode)
		} else {
			var mode = 0;
			pc_mode(mode)
		}
	} else if (ini_flag == 2) {
		$_view.html(html);
		var page = which_page(last_seq);
		$('#page_no').html(page + 'ページ目');
		if (jump_bottom) {
			to_bottom('div_view', 0)
		} else {
			to_top('div_view', 0)
		}
		now_page = which_page(last_seq)
	} else {
		var bandai = "";
		var bandai2 = "";
		var bandai = which_page(last_seq);
		if (bandai == disp_page) {
			if (_MY_SP_ != '1') {
				var _cur_scroll = $("#div_view").scrollTop();
				_cur_scroll = _cur_scroll;
				var _max_scroll = $("#div_view_in").outerHeight() - $("#div_view").height() - 100
			} else {
				var _cur_scroll = window.pageYOffset + window.innerHeight;
				_cur_scroll = _cur_scroll;
				var _max_scroll = document.documentElement.scrollHeight;
				_max_scroll = _max_scroll - 200
			}
			var _do_scroll = 0;
			if (_max_scroll <= _cur_scroll) {
				_do_scroll = 1
			}
			$_view.append(html);
			if (_do_scroll == 1) {
				if (_Android_) {
					setTimeout('to_bottom("div_view",0)', 500)
				} else {
					to_bottom('div_view', 100)
				}
			} else {
				now_received_msg[room_id] = res[0];
				if (_Android_) {
					if (document.activeElement.id != "comment") {
						$('#d_received_msg').show();
						$('#ul_received_msg').html(html)
					}
				} else {
					$('#d_received_msg').show();
					$('#ul_received_msg').html(html)
				}
			}
		} else {
			now_received_msg[room_id] = res[0];
			if (_Android_) {
				if (document.activeElement.id != "comment") {
					$('#d_received_msg').show();
					$('#ul_received_msg').html(html)
				}
			} else {
				$('#d_received_msg').show();
				$('#ul_received_msg').html(html)
			}
		}
	}
	m_hide();
	if (ini_flag == 1 || ini_flag == 2) {
		disp_page = which_page(last_seq);
		var url_page = which_page(last_seq, room_id);
		if (google_analytics) {
			if (url_page) {
				var url = "/" + room_id + "/" + url_page
			} else {
				var url = "/" + room_id + "/"
			}
			ga('send', 'pageview', url)
		}
	}
}
function send() {
	clear_fnc_validator('div_msg');
	var msg = $('#comment').val();
	if (img_src2) {
		var imgStructure = img_src2.split(',');
		if (imgStructure.length == 2) {
			var str = imgStructure[0];
			str = str.replace("data:image/", "");
			str = str.replace(";base64", "");
			if (str == "jpeg" || str == "png" || str == "gif") {} else {
				alert('添付画像エラー。画像は、jpg、png、gifのみ添付してください。');
				return
			}
		} else {
			alert('添付画像エラー。選択された画像をご確認ください');
			return
		}
	}
	var character_name = "";
	if (gloval_character_name[selected_my_icon]) {
		character_name = gloval_character_name[selected_my_icon]
	}
	var data = {
		comment: msg,
		type: "1",
		room_id: disp_room_id,
		img: img_src2,
		img_no: selected_my_icon,
		character_name: character_name
	};
	socket.json.emit('send', data);
	send_anime(uid);
	$('#comment').val("");
	img_src2 = "";
	$('#i_file2').val("");
	$('#uv').val("");
	$('#uv').hide();
	$('#file_span2').html("");
	if (_MY_SP_ == 1) {
		$('#comment').blur();
		$('#box2 .tabs').show()
	}
	check_room_list_update()
}
function send_pvm() {
	var msg = $('#i_pvt_msg').val();
	socket.json.emit('send_pvt_message', {
		'selected_uid': selected_uid,
		'msg': msg,
		'pvm_type': 1,
		'img_no': selected_my_icon
	});
	$('#i_pvt_msg').val("");
	clear_fnc_validator("d_pvt_msg");
}
function status_value() {
	var status = $('#i_status').val();
	status_change(status)
}
var isKeyPressed = false; // キーが押されているかどうかのフラグ

$(document).keydown(function(e) {
  if (isKeyPressed) {
    return; // キーが既に押されていた場合は処理を中断
  }

  isKeyPressed = true; // キーが押された状態にする

  if (e.keyCode === 37) { // ←キー
    $('#user_list li').each(function() {
      var member_id = $(this).attr("id");
      socket.json.emit('send_anime', {
        'uid': member_id,
        'room_id': disp_room_id
      });
    });
  }
  else if (e.keyCode === 39) { // →キー
    $('#user_list li').each(function() {
      var member_id = $(this).attr("id");
      socket.json.emit('write_anime', {
        'uid': member_id,
        'room_id': disp_room_id
      });
    });
  }
});

$(document).keyup(function(e) {
  isKeyPressed = false; // キーが放された状態にする
});
