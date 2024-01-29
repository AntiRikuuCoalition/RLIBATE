/* 
This tool made by AAAAAAAAAAAA.
Made at 2023/12/06.
Update at 2024/1/22.
ver β1.11
 */


//警告表示

console.log("%cSTOP！", "font-size: 65px; font-weight: bold; color: red; text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.7);");
console.log("%cこれは開発者向けのブラウザー機能です。", "font-size: 24px; font-weight: bold;");
console.log("%c誰かにここに何かをコピー・貼り付けするように言われた場合、それは第三者があなたのNETROOMアカウントへのアクセスを得るための詐欺・不正行為です。", "font-size: 18px;");
console.log("%c安全だと言われても%c絶対に貼り付け、実行をしないでください。", "font-size: 18px;", "color: red; font-weight: bold; font-size: 23px;");
console.log("%c詳細は https://www.weblio.jp/content/セルフXSS をご覧ください。", "font-size: 16px; font-style: italic;");
//定義

//ナポレオン砲ばーじょん
var napv = "v0.0";
//六保存電源
var logv = false;


//邪魔なアカウント作成メッセージ削除&ログインメッセージ変更

function change_disp_by_user_or_guest(data) {
	clear_global();
	if (data.uid) {
		uid = data.uid;
		var cmd = data.cmd;
		if (uid == "guest") { }
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
			msg: "𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙉𝙀𝙏𝙍𝙊𝙊𝙈 𝘿𝙖𝙧𝙠 𝙫𝙚𝙧𝙨𝙞𝙤𝙣, " +
				data.uname + " ."
		})
	}
	get_page();
	get_list(selected_category, searched_room_name, "")
}

//表示変更&代入
roomnam = "";
roomdes = "";
lastupd = "";
adminam = "";
adminid = "";

function drow_pvt_msg(res, prepend_flag, scrollHeight) {
	var html = "";
	for (var i = 0; i < res.length; i++) {
		var data = res[i];
		var name = data.uname;
		var msg = data.msg;
		if (data.pvm_type == 2) {
			if (data.uid == uid) {
				msg = "『フレンド申請を送信しました。』"
			} else {
				msg = "『フレンド申請が送信されました。』"
			}
		} else if (data.pvm_type == 3) {
			if (data.uid == uid) {
				msg = "『フレンド申請を承認しました。』"
			} else {
				msg = "『フレンド申請が承認されました。』"
			}
		}
		var read = "";
		if (data.uid == uid) {
			if (data.received_time) {
				read = "既読"
			}
		} else {
			if (window_focused) {
				if (data.received_time) {
					read = "既読"
				} else {
					socket.json.emit('read_pvt_msg', {
						'sender_id': data.uid,
						'pvt_msg_no': data.seq
					})
				}
			} 
		}
		var reps = replaceAll(msg, '\n', '<br>');
		html += '<li class="comment clearfix" >';
		html += '<div class="l">' + img_users_pict(data.uid, data.img_no) + '</div>';
		html += '<div class="r">';
		html += '<div class="comment_head">';
		html += '<span class="m_uname">' + name + '</span><span class="m_time">' +
			date_f(data.datetime) + '</span>';
		html += '　<span class="m_time" id="read_' + data.seq + '">' + read +
			'</span>';
		html += '</div>';
		html += '<div class="comd">' + url_to_a(reps) + '</div>';
		if (data.pvm_type == 2 && data.uid != uid && typeof (friend_store[data.uid]) ==
			"undefined" && data.done != 1) {
			html +=
				'<div class="comd"><button class="btn accept_friend" data-sender_id="' +
				data.uid + '" data-_id="' + data._id + '" > 承認 </button></div>';
			$('#b_friend_request').hide();
			$('#b_friend_cancel').hide()
		}
		html += '</div>';
		html += '</li>'
	}
	var _cur_scroll = $("#pvt_msg_in2").scrollTop();
	_cur_scroll = _cur_scroll + 350;
	var _max_scroll = $("#pvt_msg_in2").outerHeight() - $("#pvt_msg_in2").height();
	var _do_scroll = 0;
	_do_scroll = 1;
	if (prepend_flag == 1) {
		$('#pvt_msg').prepend(html);
		$("#pvt_msg li:last-child").hide();
		$("#pvt_msg li:last-child").fadeIn(500);
		if (scrollHeight) {
			to_point('pvt_msg_in2', scrollHeight)
		}
	} else {
		$('#pvt_msg').append(html);
		$("#pvt_msg li:last-child").hide();
		$("#pvt_msg li:last-child").fadeIn(500);
		if (_do_scroll == 1) {
			if (_Android_) {
				setTimeout(function () {
					to_bottom('pvt_msg_in2', 1)
				}, 500)
			} else {
				to_bottom('pvt_msg_in2', 1)
			}
		}
	}
}



function show_room_name(res) {
	roomnam = res.room_name;
	roomdes = res.room_desc;
	lastupd = res.room_update_time;
	adminam = res.admi_name;
	adminid = res.a_admi;
	var room_id = res.room_id;
	var w_permition = res.w_permition;
	prev_room_id = disp_room_id;
	disp_room_id = room_id;
	leaved_room = "";
	view_at_join_room(w_permition);
	$('#room_title').html(res.room_name);
	if (_MY_SP_ == '1') {
		$('#room_title2').html(res.room_name)
	}
	var imgdata = "";
	var html = "";
	html += '<div class="comment"><div class="l">' + img_users_pict(res.a_admi[0],
		res.admi_img_no) + '</div>';
	html += '<div class="r">';
	html += '<div class="comment_head"><span class="m_no">' +
		'</span><span class="m_uname">' + res.admi_name +
		'</span><span class="m_time">' + date_f(res.room_update_time) +
		'</span><span class="m_time">　' + adminid +
		'</span></div>';
	html += '<div class="comd">' + imgdata + comvert_msg(res.room_desc) + '</div>';
	html += '</div></div>';
	$('#room_desc').html(html);
	var uid_data = {};
	uid_data[res.a_admi[0]] = [res.admi_name, res.admi_img_no];
	add_user_store(uid_data);
	var a_admi = res.a_admi;
	admi_flag = 0;
	if (a_admi) {
		for (var i = 0; i < a_admi.length; i++) {
			if (a_admi[i] == uid) {
				admi_flag = 1
			}
		}
	}
	if (admi_flag) {
		sp_d_show();
		$('#b_change_room_info').show()
	} else {
		$('#b_change_room_info').hide()
	}
	coloring_joined_room()
}

//時間の表示変更

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
		that_s = '0' + that_s.toFixed(2);
	} else {
		that_s = that_s.toFixed(2);
	}

	datetime += ' ' + that_h + '時' + that_mt + '分' + that_s + '秒';

	return datetime;
}

//色の変更

const cssCode =
	`
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

//投稿のip抜き&その他情報表示

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
				var imgdata = '<br><img class="click_img" src="/img/tmp/' + room_id + '_' +
					data["seq"] + '.jpg" >'
			} else {
				var imgdata = ""
			}
			var is_aa = '';
			if (data.comment.indexOf('　 ') !== -1) {
				is_aa = ' is_aa'
			}
			if (data.ip && data.ip.includes(".")) {
				var ip = "i:" + data.ip;
			} else if (data.bid && data.bid.includes(".")) {
				var ip = "b:" + data.bid;
			} else {
				var ip = "i:" + (data.ip || "") + " b:" + (data.bid || "");
			}

			if (data.ip && data.ip.includes(".")) {
				var ip2 = data.ip;
			} else if (data.bid && data.bid.includes(".")) {
				var ip2 = data.bid;
			} else {
			}
			var syounin = "";
			if (ip2 === "133.114.35.230") {
				var syounin = '<font color="red" size="1">→管理人様</font>'
			}
			if (data.uid === "5424e6a7969d48ef3baadbdf") {
				var syounin = '<font color="red" size="1">→管理人様</font>'
			}
			
			

			var u_id = data.uid;
			html += '<div id="' + id_head + data["seq"] + '" class="comment clearfix" >';
			html += '<div class="l">' + img_users_pict(data.uid, data.img_no) + '</div>';
			html += '<div class="r">';
			html += '<div class="comment_head"><span class="m_no">' + data["seq"] +
				'</span><span class="m_uname">' + name + '</span><span class="m_time">' +
				date_f(data.time) + '</span><span class="at_uname">　 ' + ip +
				'</span>' + syounin + '<span class="m_time">　 ' + u_id + '</div>';
			html += '<div class="comd' + is_aa + '">' + comvert_msg(data.comment) +
				imgdata + '</div>';
			html += '</div>';
			html += '</div>';
			last_id = 'c' + data["seq"];
			last_seq = data["seq"] - 0
		}
	}
	if (target == 1) {
		$('#d_msg_one div.h').html(
			'<div class="h clearfix ipop_title"><small class="link_pankuzu">≫' + data[
			"seq"] +
			'</small><div class="d_close"><span class="close" id="close_d_msg_one">&#12288;×&#12288;</span></div></div>'
		);
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
				var _max_scroll = $("#div_view_in").outerHeight() - $("#div_view").height() -
					100
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

//投稿送信の文字数制限解除

function send() {
	clear_fnc_validator('div_msg');
	var msg = $('#comment').val();
	if (img_src2) {
		var imgStructure = img_src2.split(',');
		if (imgStructure.length == 2) {
			var str = imgStructure[0];
			str = str.replace("data:image/", "");
			str = str.replace(";base64", "");
			if (str == "jpeg" || str == "png" || str == "gif") { } else {
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

//個チャの文字数制限解除

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

//ステータスの文字数制限解除

function status_value() {
	var status = $('#i_status').val();
	status_change(status)
}

//テンキーの-キーと/キーで送信操作

var isKeyPressed = false;

$(document).keydown(function (e) {
	if (isKeyPressed) {
		return;
	}
	isKeyPressed = true;

	if (e.keyCode === 109) {
		if (logv == false) {
			$('#user_list li').each(function () {
				var member_id = $(this).attr("id");
				socket.json.emit('send_anime', {
					'uid': member_id,
					'room_id': disp_room_id
				});
			});
		}
	} else if (e.keyCode === 111) {
		if (logv == false) {
			$('#user_list li').each(function () {
				var member_id = $(this).attr("id");
				socket.json.emit('write_anime', {
					'uid': member_id,
					'room_id': disp_room_id
				});
			});
		}
	}
});

$(document).keyup(function (e) {
	isKeyPressed = false;
});

//ようこそメッセージ(ロビー)変更

const netRoomElement = document.querySelector('.tmg_tip');
const newContent =
	'<b>𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙉𝙀𝙏𝙍𝙊𝙊𝙈 𝘿𝙖𝙧𝙠 𝙫𝙚𝙧𝙨𝙞𝙤𝙣.</b><p>NETROOM Dark versionは様々な機能を追加する拡張機能です!<br>本来のチャットと少しかけ離れて楽しんでみてはいかがですか?</p>';
netRoomElement.innerHTML = newContent;

//HTMLのタイトル変更(スクロール機能)
var intervalId;

function set_url_mode(room_id, page, title, cmd) {
	now_cmd = cmd;
	var disp_room_id = get_parameter();
	var disp_page = get_parameter(1);

	if (!validator.isNumeric(room_id + "")) {
		room_id = 0;
	}

	if (!validator.isNumeric(page + "")) {
		page = 0;
	}

	var url_page = "";
	if (page) {
		url_page = page;
	}

	var max_page = "";
	if (typeof (last_msg_seq[room_id]) != 'undefined') {
		var room_last_seq = last_msg_seq[room_id];
		max_page = which_page(room_last_seq);
	}

	if (max_page == url_page) {
		url_page = "";
		page = 0;
	}

	if (disp_room_id == room_id && disp_page == page) {
		get_page(1);
		return;
	}

	if (room_id - 0) {
		var _suf = '&p=';

		if (Number(url_page) < 1) {
			_suf = '';
		}

		var url_param = "/?r=" + room_id + _suf + url_page;

		if (title) {
			title = title + ' | NETROOM Dark version　　　　';
		} else {
			title = document.title;
		}
	} else {
		var url_param = "/";
		title = 'Room List | NETROOM Dark version　　　　';
	}

	History.pushState({
		room_id: room_id,
		page: page
	}, title, url_param);

	if (Number(url_page) < 1) {
		twiFunc();
	}

	var scrollTitle = title;
	clearInterval(intervalId);

	intervalId = setInterval(function () {
		scrollTitle = scrollTitle.substring(1) + scrollTitle.substring(0, 1);
		document.title = scrollTitle;
	}, 800);
}

//HTMLのタイトル画像変更

var image = document.querySelector('#topimg_wrapper img');
var newImageSrc =
	'data:image/png;base64,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';
image.src = newImageSrc;

//ファビコン変更

var linkElement = document.querySelector('link[rel="shortcut icon"]');
var newUrl =
	"data:image/png;base64,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";
linkElement.href = newUrl;

//ロゴ変更

var logo = document.querySelector('.logo');
var newImage = new Image();
newImage.src = 'data:image/png;base64,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';
newImage.classList.add('logo');

logo.parentNode.insertBefore(newImage, logo);
logo.parentNode.removeChild(logo);

//追加機能

//ヘルプタブ表示
var tabother = document.createElement("div");
tabother.classList.add("tab");
tabother.id = "tab_other";
tabother.innerHTML = '<span>ヘルプ</span>';
document.getElementById("box3").querySelector(".tabs").appendChild(tabother);

function openNewTab() {
	window.open("http://netroom.co.jp", "_blank");
}
var button = document.querySelector("#tab_other span");
button.addEventListener("click", openNewTab);


//大阪弁bot(nrajs様より)
var toolButtonA = document.createElement('button');
toolButtonA.id = 'tool_btn_a';
toolButtonA.textContent = '大阪弁';
toolButtonA.style.display = 'inline';
var returnButton = document.getElementById('return_btn');
returnButton.parentNode.insertBefore(toolButtonA, returnButton.nextSibling);
toolButtonA.addEventListener('click', function () {
	osakaaa();
});

// ツールボタンB
var toolButtonB = document.createElement('button');
toolButtonB.id = 'tool_btn_b';
toolButtonB.textContent = 'ログ保存';
toolButtonB.style.display = 'inline';
returnButton.parentNode.insertBefore(toolButtonB, returnButton.nextSibling);
toolButtonB.addEventListener('click', function () {
	savelog();
});

// ツールボタンC
var toolButtonC = document.createElement('button');
toolButtonC.id = 'tool_btn_c';
toolButtonC.textContent = 'ボタンc';
toolButtonC.style.display = 'inline';
toolButtonC.style.marginLeft = '10px'; // 左側に10pxのスペースを作る
returnButton.parentNode.insertBefore(toolButtonC, returnButton.nextSibling);
toolButtonC.addEventListener('click', function () {
	console.log('ボタンc');
});

//ボタンのスタイル追加

const cssCode1 =
	`
  #tool_btn_a,
  #tool_btn_b,
  #tool_btn_c {
    background: none repeat scroll 0 0 #fff;
    color: #333;
    font-family: メイリオ;
    font-size: 11px;
    height: 24px;
    line-height: 1;
    margin-top: 9px;
    padding: 0 15px;
    vertical-align: top;
  }
  
  #tool_btn_a:hover,
  #tool_btn_b:hover,
  #tool_btn_c:hover {
    background:#efefef;
  }
`;
const styleElement1 = document.createElement('style');
styleElement1.innerHTML = cssCode1;
document.head.appendChild(styleElement1);

function calculateTime(s) {
	const dataPerSecond = 20000 / 121; // 1秒あたりのデータ数
	const time = s / dataPerSecond; // 時間（秒）

	const minutes = Math.floor(time / 60); // 分
	const seconds = Math.floor(time % 60); // 秒（切り捨て）

	return `${minutes}分${seconds}秒`;
}


//大阪弁bot
powero = false;
var replacements = {
	"ありがとうございました": "おおきに",
	"有難うございました": "おおきに",
	"有り難うございました": "おおきに",
	"有難う御座いました": "おおきに",
	"有り難う御座いました": "おおきに",
	"あなた": "あんさん",
	"彼方": "あんさん",
	"貴方": "あんさん",
	"貴女": "あんさん",
	"貴男": "あんさん",
	"あんな": "あないな",
	"りますので": "るさかいに",
	"りますから": "るさかいに",
	"あります": "あるんや",
	"在ります": "あるんや",
	"有ります": "あるんや",
	"或ります": "あるんや",
	"あるいは": "せやなかったら",
	"或いは": "せやなかったら",
	"ありません": "おまへん",
	"在りません": "おまへん",
	"有りません": "おまへん",
	"ありました": "おました",
	"在りました": "おました",
	"有りました": "おました",
	"いない": "おらへん",
	"居ない": "おらへん",
	"いままでの": "ムカシからの",
	"いままで": "本日この時まで",
	"今まで": "本日この時まで",
	"今までの": "ムカシからの",
	"いまどき": "きょうび",
	"今時": "きょうび",
	"いわゆる": "なんちうか，ようみなはんいわはるとこの",
	"所謂": "なんちうか，ようみなはんいわはるとこの",
	"思いますが": "思うんやが",
	"思います": "思うで",
	"いただいた": "もろた",
	"いただきます": "もらうで",
	"いただきました": "もろた",
	"戴いた": "もろた",
	"頂いた": "もろた",
	"いただきます": "もらうで",
	"頂きます": "もらうで",
	"頂きます": "もらうで",
	"いただきました": "もろた",
	"頂きました": "もろた",
	"戴きました": "もろた",
	"いくら": "なんぼ",
	"幾ら": "なんぼ",
	"いるか": "おるか",
	"居るか": "おるか",
	"いますので": "おるさかいに",
	"いますから": "おるさかいに",
	"居ますので": "おるさかいに",
	"居ますから": "おるさかいに",
	"いちど": "いっぺん",
	"一度": "いっぺん",
	"いますが": "おるけどダンさん",
	"居ますが": "おるけどダンさん",
	"いました": "おったんや",
	"居ました": "おったんや",
	"います": "いまんねん",
	"居ます": "いまんねん",
	"えない": "えへん",
	"おかしな": "ケッタイな",
	"可笑しな": "ケッタイな",
	"おきました": "おいたんや",
	"置きました": "おいたんや",
	"起きました": "おいたんや",
	"おきた": "おいたんや",
	"置いた": "おいたんや",
	"起きた": "おいたんや",
	"かなあ": "かいな",
	"かならず": "じぇったい",
	"かもな": "かもしれへんな",
	"かもね": "かもしれへんな",
	"かも。": "かもしれへんな",
	"かも、": "かもしれへんな",
	"かも.": "かもしれへんな",
	"かも・": "かもしれへんな",
	"必ず": "じぇったい",
	"かわいい": "メンコイ",
	"可愛い": "メンコイ",
	"おそらく": "ワイが思うには",
	"恐らく": "ワイが思うには",
	"おもしろい": "オモロイ",
	"面白い": "おもろい",
	"ください": "おくんなはれ",
	"下さい": "おくんなはれ",
	"詳しく": "ねちっこく",
	"くわしく": "ねちっこく",
	"けない": "けへん",
	"ございます": "おます",
	"ございました": "おました",
	"御座います": "おます",
	"御座いました": "おました",
	"こちら": "ウチ",
	"此方": "ウチ",
	"こんな": "こないな",
	"この頃": "きょうび",
	"このごろ": "きょうび",
	"下さい": "くれへんかの",
	"さようなら": "ほなさいなら",
	"左様なら": "ほなさいなら",
	"さん": "はん",
	"しかし": "せやけどダンさん",
	"然し": "せやけどダンさん",
	"しかたない": "しゃあない",
	"仕方ない": "しゃあない",
	"しなければ": "せな",
	"しない": "せん",
	"しばらく": "ちーとの間",
	"暫く": "ちーとの間",
	"している": "しとる",
	"しました": "したんや",
	"しまいました": "しもたんや",
	"しますか": "しまっか",
	"しますと": "すやろ，ほしたら",
	"しまった": "しもた",
	"しますので": "するさかいに",
	"するとき": "するっちうとき",
	"する時": "するっちうとき",
	"すべて": "ずぅぇえええぇぇええんぶ",
	"全て": "ずぅぇえええぇぇええんぶ",
	"すくなくとも": "なんぼなんでも",
	"少なくとも": "なんぼなんでも",
	"ずに": "んと",
	"すごい": "どエライ",
	"少し": "ちびっと",
	"せない": "せへん",
	"そこで": "ほんで",
	"其処で": "ほんで",
	"そして": "ほんで",
	"そんな": "そないな",
	"そうだろ": "そうやろ",
	"それから": "ほんで",
	"それでは": "ほなら",
	"たとえば": "例あげたろか，たとえばやなあ",
	"例えば": "例あげたろか，たとえばやなあ",
	"たのです": "たちうワケや",
	"たので": "たさかい",
	"ただし": "せやけど",
	"但し": "せやけど",
	"たぶん": "タブン．．．たぶんやで，わいもよーしらんがタブン",
	"多分": "タブン．．．たぶんやで，わいもよーしらんがタブン",
	"たくさん": "ようけ",
	"沢山": "ようけ",
	"だった": "やった",
	"だけど": "やけど",
	"だから": "やから",
	"だが": "やけど",
	"だと": "やと",
	"だし": "やし",
	"だろ": "やろ",
	"だね。": "やね。",
	"ちなみに": "余計なお世話やけど",
	"因みに": "余計なお世話やけど",
	"ちょっと": "ちーとばかし",
	"一寸": "ちーとばかし",
	"ったし": "ったことやねんし",
	"つまり": "ゴチャゴチャゆうとる場合やあれへん，要は",
	"つまらない": "しょーもない",
	"であった": "やった",
	"ている": "とる",
	"ていただいた": "てもろた",
	"て頂きます": "てもらうで",
	"ていただきます": "てもらうで",
	"ていただく": "てもらうで",
	"ていただ": "ていただ",
	"ていた": "とった",
	"多く": "ようけ",
	"ですか": "やろか",
	"ですよ": "や",
	"ですが": "やけどアンタ",
	"ですね": "やね",
	"でした": "やった",
	"でしょう": "でっしゃろ",
	"できない": "でけへん",
	"ではない": "ではおまへん",
	"です": "や",
	"てない": "てへん",
	"どういうわけか": "なんでやろかわいもよーしらんが",
	"どういう訳か": "なんでやろかわいもよーしらんが",
	"どうだ": "どや",
	"どうなの": "どうなん",
	"どこか": "どこぞ",
	"何処か": "どこぞ",
	"どんな": "どないな",
	"という": "ちう",
	"とすれば": "とするやろ，ほしたら",
	"ところが": "トコロが",
	"ところ": "トコ",
	"とても": "どエライ",
	"なぜか": "なんでやろかわいもよーしらんが",
	"なった": "なりよった",
	"なのですが": "なんやけど",
	"なのです": "なんやこれがホンマに",
	"なので": "やので",
	"なぜ": "なんでやねん",
	"など": "やらなんやら",
	"ならない": "ならへん",
	"なりました": "なったんや",
	"なれた?": "なれたん?",
	"なれた？": "なれたん？",
	"なんでも": "何ぞしら",
	"のちほど": "ノチカタ",
	"のです": "のや",
	"はじめまして": "はじめてお目にかかりまんなあ",
	"ひとたち": "ヤカラ",
	"人たち": "ヤカラ",
	"人達": "ヤカラ",
	"ヘルプ": "助け船",
	"ほんとう": "ホンマ",
	"ほんと": "ホンマ",
	"まいますので": "まうさかいに",
	"まったく": "まるっきし",
	"全く": "まるっきし",
	"ません": "まへん",
	"ました": "たんや",
	"ますか": "まっしゃろか",
	"ますが": "まっけど",
	"ましょう": "まひょ",
	"ますので": "よるさかいに",
	"むずかしい": "ややこしい",
	"難しい": "ややこしい",
	"めない": "めへん",
	"もらった": "もろた",
	"貰った": "もろた",
	"もらって": "もろて",
	"貰って": "もろて",
	"ります": "るんや",
	"らない": "りまへん",
	"りない": "りまへん",
	"れない": "れへん",
	"ます": "まんねん",
	"先ず": "まんねん",
	"もっとも": "もっとも",
	"ようやく": "ようやっと",
	"よろしく": "よろしゅう",
	"るのです": "るちうワケや",
	"だ。": "や。",
	"りました": "ったんや",
	"る。": "るちうわけや。",
	"い。": "いちゅうわけや。",
	"た。": "たちうわけや。",
	"う。": "うわ。",
	"わがまま": "ワガママ",
	"まま": "まんま",
	"われわれ": "ウチら",
	"我々": "ウチら",
	"わたし": "わい",
	"私": "わい",
	"ぼく": "わい",
	"僕": "わい",
	"我輩": "わい",
	"吾輩": "わい",
	"我が輩": "わい",
	"わない": "いまへん",
	"全て": "みな",
	"全部": "ぜええんぶひとつのこらず",
	"全然": "さらさら",
	"ぜんぜん": "サラサラ",
	"大変な": "エライ",
	"大変": "エライ",
	"非常に": "どエライ",
	"違う": "ちゃう",
	"古い": "古くさい",
	"最近": "きょうび",
	"以前": "エライ昔",
	"無効": "チャラ",
	"中止": "ヤメ",
	"海外": "アチラ",
	"難しい": "ややこしい",
	"遅い": "とろい",
	"良い": "ええ",
	"入れる": "ぶちこむ",
	"来た": "来よった",
	"同時": "いっぺん",
	"先頭": "アタマ",
	"置換": "とっかえ",
	"注意": "用心",
	"最後": "ケツ",
	"我々": "うちら",
	"初心者": "どシロウト",
	"付属": "オマケ",
	"誤って": "あかーんいうて誤って",
	"商人": "あきんど",
	"商売": "ショーバイ",
	"商業": "ショーバイ",
	"誰": "どなたはん",
	"再度": "もっかい",
	"再び": "もっかい",
	"自動的に": "なあんもせんとホッタラかしといても",
	"無料": "タダ",
	"変化": "変身",
	"自分": "オノレ",
	"失敗": "シッパイ",
	"優先": "ヒイキ",
	"特長": "ええトコ",
	"概要": "おーまかなトコ",
	"概念": "能書き",
	"アルゴリズム": "理屈",
	"実用的": "アホでも使えるよう",
	"何も": "なあんも",
	"何か": "何ぞ",
	"子供": "ボウズ",
	"いい": "ええ"
};
var powero = false;

function osakaaa() {
	if (powero == false) {
		show_notice({
			msg: "大阪弁botをオンにしました。"
		}, 4000)
		send = function () {
			clear_fnc_validator('div_msg');
			var msg = $('#comment').val();
			if (img_src2) {
				var imgStructure = img_src2.split(',');
				if (imgStructure.length == 2) {
					var str = imgStructure[0];
					str = str.replace("data:image/", "");
					str = str.replace(";base64", "");
					if (str == "jpeg" || str == "png" || str == "gif") { } else {
						alert('添付画像エラー。画像は、jpg、png、gifのみ添付してください。');
						return;
					}
				} else {
					alert('添付画像エラー。選択された画像をご確認ください');
					return;
				}
			}
			var character_name = "";
			if (gloval_character_name[selected_my_icon]) {
				character_name = gloval_character_name[selected_my_icon];
			}
			var osaka = msg;
			var osaka1 = osaka;

			for (var key in replacements) {
				osaka1 = osaka1.replace(new RegExp(key, "g"), replacements[key]);
			}

			var data = {
				comment: osaka1,
				type: "1",
				room_id: disp_room_id,
				img: img_src2,
				img_no: selected_my_icon,
				character_name: "大阪弁変換bot"
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
				$('#box2 .tabs').show();
			}
			check_room_list_update();
		}

		send_pvm = function () {
			var msg = $('#i_pvt_msg').val();
			var osaka = msg;
			var osaka1 = osaka;

			for (var key in replacements) {
				osaka1 = osaka1.replace(new RegExp(key, "g"), replacements[key]);
			}

			socket.json.emit('send_pvt_message', {
				'selected_uid': selected_uid,
				'msg': osaka1,
				'pvm_type': 1,
				'img_no': selected_my_icon
			});
			$('#i_pvt_msg').val("");
			clear_fnc_validator("d_pvt_msg");
		}

		status_change = function (status) {
			if (status == "なし") {
				status = "";
			}
			var osaka = status;
			var osaka1 = osaka;

			for (var key in replacements) {
				osaka1 = osaka1.replace(new RegExp(key, "g"), replacements[key]);
			}

			var data = {
				'status': osaka1,
				'room_id': disp_room_id
			};
			socket.json.emit('change_status', data);
			$('#user_status_window').hide();
		}

		var statusUl = document.getElementById("status_table");
		var statusList = statusUl.getElementsByTagName("li");
		var newStatus = [
			"なし",
			"離席中や",
			"食事中や",
			"トイレ中や",
			"勉強中や",
			"仕事中や",
			"作業中や",
			"ゲーム中や",
			"読書中や",
			"TV中や",
			"ROM中や",
			"入浴中や",
			"家事中や",
			"メール中や",
			"挨拶不要ROMや",
			"話しかけへんでくれお願いな",
			"休憩中や",
			"就寝中や"
		];

		for (var i = 0; i < statusList.length; i++) {
			statusList[i].textContent = newStatus[i];
		}

		powero = true;
	} else {
		show_notice({
			msg: "大阪弁botをオフにしました。"
		}, 4000)
		send = function () {
			clear_fnc_validator('div_msg');
			var msg = $('#comment').val();
			if (img_src2) {
				var imgStructure = img_src2.split(',');
				if (imgStructure.length == 2) {
					var str = imgStructure[0];
					str = str.replace("data:image/", "");
					str = str.replace(";base64", "");
					if (str == "jpeg" || str == "png" || str == "gif") { } else {
						alert('添付画像エラー。画像は、jpg、png、gifのみ添付してください。');
						return;
					}
				} else {
					alert('添付画像エラー。選択された画像をご確認ください');
					return;
				}
			}
			var character_name = "";
			if (gloval_character_name[selected_my_icon]) {
				character_name = gloval_character_name[selected_my_icon];
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
				$('#box2 .tabs').show();
			}
			check_room_list_update();
		}

		send_pvm = function () {
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

		status_change = function (status) {
			if (status == "なし") {
				status = "";
			}
			var data = {
				'status': status,
				'room_id': disp_room_id
			};
			socket.json.emit('change_status', data);
			$('#user_status_window').hide();
		}

		var statusUl = document.getElementById("status_table");
		var statusList = statusUl.getElementsByTagName("li");
		var newStatus = [
			"なし",
			"離席中",
			"食事中",
			"トイレ中",
			"勉強中",
			"仕事中",
			"作業中",
			"ゲーム中",
			"読書中",
			"TV中",
			"ROM中",
			"入浴中",
			"家事中",
			"メール中",
			"挨拶不要ROM",
			"話しかけないでお願い",
			"休憩中",
			"就寝中"
		];

		for (var i = 0; i < statusList.length; i++) {
			statusList[i].textContent = newStatus[i];
		}

		powero = false;
	}
}

//キーファンクション機能
document.addEventListener('keydown', function (event) {
	if (logv == false) {
		if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName ===
			'TEXTAREA') {
			return;
		}

		// ナポレオン砲
		if (event.key === 'V' && event.shiftKey) {
			if (!event.repeat) {
				if (sending1 == true) {
					sending1 = false;
					alert("砲撃を中止しました。");
				} else {
					vand();
				}
			}
		}

		// プライベートメッセージ手動
		if (event.key === 'P' && event.shiftKey) {
			if (!event.repeat) {
				oppv();
			}
		}

		//部屋検索ツール
		if (event.key === 'F' && event.shiftKey) {
			if (!event.repeat) {
				romse();
			}
		}

		//ログ保存ツール
		if (event.key === 'S' && event.shiftKey) {
			if (!event.repeat) {
				savelog()
			}
		}
	}
});

//ナポレオン砲 v0.0
var sending1 = false;

function vand() {
	var result1 = window.confirm('ナポレオン砲' + napv +
		"を起動しますか?\n※誤起動の場合はキャンセルを押してください。");
	if (result1) {
		var msg = prompt("砲撃に使用する文を入力してください。");
		var num = prompt("砲撃回数を入力してください。");
		var rom = prompt(
			"砲撃する部屋を入力してください。\n注:部屋名ではなくて部屋番号です。\n(この部屋で砲撃する場合は空欄にしてもいいです。)");
		if (rom === "") {
			var rom = disp_room_id;
		} else { }
		var ico = prompt("砲撃で使用するアイコンの番号を入力してください。\n(新規アイコンの場合は何も入力しないでいいです。)");
		var imm = prompt(
			"画像を投稿する場合は画像のデータURLを入力してください。\n(ない場合は何も入力しないでいいです。)\n※データURLについては公式ホームページにて"
		);
		var nam = prompt("キャラクター名を入力してください。\n(使用しない場合空白で大丈夫です。)");
		var result2 = window.confirm('以下の内容で砲撃しますか?\n砲撃文:' + msg + "\n砲撃回数:" + num +
			"\n砲撃標的:" + rom + "\n砲撃に使用するアイコン:" + ico +
			"\n※砲撃をやめる場合はキャンセルを、砲撃中に砲撃中止をする場合はShift+Vをもう一度押してください。");
		if (result2) {
			sending1 = true;
			let count = 0;

			function loop() {
				if (count < num) {
					if (sending1 == true) {
						socket.json.emit('send', {
							comment: msg,
							type: "1",
							room_id: rom,
							img: imm,
							img_no: ico,
							character_name: nam
						});
						count++;
						setTimeout(loop, 0);
					}
				} else {
					sending1 = false;
				}
			}
			loop();
		} else { }

	} else { }
};

//プライベートメッセージ
function oppv() {
	var id1 = prompt(
		"プライベートメッセージを開きたいアカウントのIDを入力してください。\n※IDとはアカウント名ではなく例:\n5424e6a7969d48ef3baadbdf\nのような感じのものです。入手方法についてはヘルプに書いてあります。"
	);
	open_pvm(id1, "1", "")
}

//部屋検索
function romse() {
	var category = prompt(
		"こちらは部屋検索ツールです。カテゴリーを入力してください。(空白でも大丈夫です。)\n注意:カテゴリは一言一句一致しないといけません。その為実在しないものや打ち間違いなどがあった場合カテゴリは指定無しとして処理されます。"
	)
	var room_name = prompt("部屋名を入力してください。(空白でも大丈夫です。)")
	get_list(category, room_name, "")
}

//時計機能

var clock = document.createElement('div');
clock.id = 'clock';
clock.style.display = 'inline';
clock.style.color = 'white';
clock.style.fontSize = '13pt';

function updateClock() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var ampm = hours >= 12 ? '午後' : '午前';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	clock.textContent = ampm + ' ' + hours + '時 ' + minutes + '分 ' + seconds + '秒';
}

setInterval(updateClock, 500);

var myinfowrap = document.getElementById("myinfowrap");
myinfowrap.insertBefore(clock, myinfowrap.firstChild);

//吹き出しが消えなかった時のための削除ツール
var myinfowrap_fikidashi = document.getElementById("myinfowrap_fikidashi");
myinfowrap_fikidashi.parentNode.removeChild(myinfowrap_fikidashi);


let total = "";
var show_msg
var intt = "";

function record(ms) {
	total += ms;
}

// 半透明な灰色の壁を作成する関数
let overlay = null;
let loadingText = null;

function createOverlay() {
	// オーバーレイ要素が既に存在する場合は削除する
	if (overlay) {
		overlay.remove();
	}

	// オーバーレイ要素の作成
	overlay = document.createElement('div');
	overlay.classList.add('overlay'); // クラス名を追加

	// スタイルの設定
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	overlay.style.zIndex = '9999';

	// テキスト要素の作成
	loadingText = document.createElement('div');
	loadingText.style.color = '#ffffff';
	loadingText.style.fontSize = '24px';
	loadingText.style.textAlign = 'center';
	loadingText.style.position = 'absolute';
	loadingText.style.top = '50%';
	loadingText.style.left = '50%';
	loadingText.style.transform = 'translate(-50%, -50%)';

	// オーバーレイ要素にテキスト要素を追加
	overlay.appendChild(loadingText);

	// ボディ要素にオーバーレイ要素を追加
	document.body.appendChild(overlay);
}


// 変数の値を更新する関数
function updateText(text) {
	if (loadingText) {
		loadingText.textContent = text;
	}
}


// 半透明な灰色の壁を削除する関数
function removeOverlay() {
	let overlay = document.querySelector('.overlay');
	if (overlay) {
		document.body.removeChild(overlay);
	}
}

let date_ka = "";
var intlog = "";

function savelog() {

	// 時間
	date_ka = function (date) {
		let that = new Date(date);
		let now = new Date();
		let that_y = that.getFullYear();
		let that_m = that.getMonth() + 1;
		let that_d = that.getDate();
		let that_h = that.getHours();
		let that_mt = that.getMinutes();
		let that_s = that.getSeconds() + that.getMilliseconds() / 1000;
		let now_y = now.getFullYear();
		let now_m = now.getMonth() + 1;
		let now_d = now.getDate();

		let datetime = '';

		datetime += that_y + '年';
		datetime += that_m + '月' + that_d + '日';
		if (that_h < 10) {
			that_h = '0' + that_h;
		}

		if (that_mt < 10) {
			that_mt = '0' + that_mt;
		}

		if (that_s < 10) {
			that_s = '0' + that_s.toFixed(2);
		} else {
			that_s = that_s.toFixed(2);
		}

		datetime += ' ' + that_h + '時' + that_mt + '分' + that_s + '秒';

		return datetime;
	}
	//roomnam = "";
	//roomdes = "";
	//lastupd = "";
	//adminam = "";
	//adminid = "";date_ka(data.time)
	// 保存ツール
	let result2 = window.confirm(
		'ログ保存ツールを起動しますか?\n※誤起動の場合はキャンセルを押してください。\n部屋名等が記録できない時があるのでヘルプページをご確認ください。');
	if (result2) {
		logv = true;
		intlog = parseInt(prompt("ログの数(最後に投稿された投稿の数)を入力してください。"));
		total = "";
		createOverlay();
		// 変数の値を更新
		let myText = '保存中...';
		updateText(myText);
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds() + now.getMilliseconds() / 1000).padStart(
			2, '0');
		const roundedSeconds = Math.round(seconds * 100) / 100; // 小数点第三位を四捨五入

		const timestamp =
			`${year}年${month}月${day}日 ${hours}時${minutes}分${roundedSeconds.toFixed(2)}秒`;
		record("𝙉𝙀𝙏𝙍𝙊𝙊𝙈 𝘿𝙖𝙧𝙠 𝙫𝙚𝙧𝙨𝙞𝙤𝙣ログ保存ツール v0.0\n\n保存日時:" +
			timestamp + "\n部屋ID:" + disp_room_id + "\n部屋名:" + roomnam + "\n部屋説明:\n" +
			repa(roomdes) + "\n管理者:" + adminam + "\n管理者アカウントのID:" + adminid +
			"\n部屋の最終更新:" + date_ka(lastupd) + "\n\n＿＿＿＿＿＿以降過去ログ\n\n");
		let count = 0;
		show_msg = function (room_id, res, ini_flag, target, nowHeight) {
			for (var i = 0; i < res.length; i++) {
				if (res[i]["comment"] != undefined) {
					data = res[i];
					if (data.uname == '') {
						name = 'ゲスト'
					} else {
						name = data.uname;
						if (data.character_name) {
							name = data.character_name + '@' + name
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
				}

				//data.bid ip
				//date_ka(data.time) 時間
				//name アカウント名
				//comvert_msg(data.comment) コメント
				//data.img_no 画像ID
				//data.seq 回数
				//data.uid アカウントID
				//data._id 投稿ID

			}
			if (target == 1) {
				intt = data.seq;
				var intlog2 = intlog - 1;
				// 変数の値を更新
				let myText = '保存中...';
				hya = intlog2 - data.seq;
				updateText("保存中...\n" + data.seq + "/" + intlog2 + "　保存終了まであと約" +
					calculateTime(hya));
				record(data.seq + "　" + date_ka(data.time) + "　投稿者名:" + name + "　アイコンID:" +
					data.img_no + "　アカウントID:" + data.uid + "　IP(b):" + data.bid + "(i):" + data.ip + "\n投稿:\n" +
					repa(data.comment) + "\n\n");
			}
		}
		intlog++
		count = 1;

		function loop2() {
			if (count < intlog) {
				socket.json.emit('one_msg', {
					'seq': count,
					'room_id': disp_room_id
				});
				count++;
				setTimeout(loop2, 5);
			} else {
				setTimeout(() => {
					saveTextFile("ログ保存ツール " + disp_room_id, total);
					retumsg()
					removeOverlay();
					logv = false;
				}, 3000);
			}
		}
		loop2();
	} else { }
}


function repa(str) {
	return str.replace(/&gt;/g, '>');
}


function saveTextFile(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
		encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}


function retumsg() {
	show_msg = function (room_id, res, ini_flag, target, nowHeight) {
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
					var imgdata = '<br><img class="click_img" src="/img/tmp/' + room_id + '_' +
						data["seq"] + '.jpg" >'
				} else {
					var imgdata = ""
				}
				var is_aa = '';
				if (data.comment.indexOf('　 ') !== -1) {
					is_aa = ' is_aa'
				}
				if (data.ip && data.ip.includes(".")) {
					var ip = "i:" + data.ip;
				} else if (data.bid && data.bid.includes(".")) {
					var ip = "b:" + data.bid;
				} else {
					var ip = "i:" + (data.ip || "") + " b:" + (data.bid || "");
				}

				if (data.ip && data.ip.includes(".")) {
					var ip2 = data.ip;
				} else if (data.bid && data.bid.includes(".")) {
					var ip2 = data.bid;
				} else {
				}
				var syounin = "";
				if (ip2 === "133.114.35.230") {
					var syounin = '<font color="red" size="1">→管理人様</font>'
				}
				if (data.uid === "5424e6a7969d48ef3baadbdf") {
					var syounin = '<font color="red" size="1">→管理人様</font>'
				}



				var u_id = data.uid;
				html += '<div id="' + id_head + data["seq"] + '" class="comment clearfix" >';
				html += '<div class="l">' + img_users_pict(data.uid, data.img_no) + '</div>';
				html += '<div class="r">';
				html += '<div class="comment_head"><span class="m_no">' + data["seq"] +
					'</span><span class="m_uname">' + name + '</span><span class="m_time">' +
					date_f(data.time) + '</span><span class="at_uname">　 ' + ip +
					'</span>' + syounin + '<span class="m_time">　 ' + u_id + '</div>';
				html += '<div class="comd' + is_aa + '">' + comvert_msg(data.comment) +
					imgdata + '</div>';
				html += '</div>';
				html += '</div>';
				last_id = 'c' + data["seq"];
				last_seq = data["seq"] - 0
			}
		}
		if (target == 1) {
			$('#d_msg_one div.h').html(
				'<div class="h clearfix ipop_title"><small class="link_pankuzu">≫' + data[
				"seq"] +
				'</small><div class="d_close"><span class="close" id="close_d_msg_one">&#12288;×&#12288;</span></div></div>'
			);
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
					var _max_scroll = $("#div_view_in").outerHeight() - $("#div_view").height() -
						100
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
}







//ダミー文字定義(難読化解読防止)
//漢字＆仮名
function sxbzuwwqpzmybsmoc() {
var 元開我炭中如 = '明位明ま';
var 学点ま葉乗女等し高赤書携と灰適 = '和地て針持野為健暖';
var 赤春た過球位ら吾青さ正室有勝 = 'き仕複開行事亮遠低位明授紫画渋元社';
var 帯飲つ心 = '為前暖ち者と認事記研黄元るね議の会秋絵南教暗的天等';
var 敗名調授取茶灰渋 = 'ん校込適伊立春か件等仕満門そ暖';
var 語使屋勉室踊足場会乗場研みち右灰戸白野女書帯喜授則 = '努事会対賃規論て右近休む色百久写如正日者ね内容制を肉';
var 紙ら社右返市開南持阿和専歩和返進伊敗会容漢制年る = '塩歩んこい';
var 施発金会踊き前軍ち内日前暗表秋軍議語持美久戦左好球 = '立や語早阿渋百夏心て示過携場';
var 箸晴せ通情右使葉策訓 = '白制悲草ゆ法必専か読そ我け開朝秋学直矢書は元亮橋教済名正し';
var 肺水陽過お = '満屋室間遠調妻意始後暖お授記ろほ曇';
var てをみ明 = '京社始輩竹陽戸為消茶言規読子読くえ朝渋我同業れ社';
var 左指土日色学自漢者阿そ明お光為言業東火有如野雨使決年炭か輩仕 = 'た塩値あ酒過使我あ緑専場西会取画賃悲村陽回光';
var 座わ秋観漢勉写減持関我妻年亮り如如星行明か意 = '戦則容絵法点端働言同茶ら係話飲府ゆ仕居読絵返市取妻自過';
var か寒京専本業持点色 = '業合曜発そ乗北右休来言業和力';
var 済茶一周来指過制低足飲秋位中木こ = '仕美竹こ名意漢行紙阿医携女悲引緑進科画百';
var 市量律門真康帰認草輩如戸給西灰 = 'ゆ室前真連滝は済れ絵吾え暖永南盛';
var 交暖光同場た美帰連雨れ星箸黄 = '阿明複南秋';
var 訪必そ必同敗と同書教橋秋事打開天行画雨年年踊我連 = 'よ心地発き満橋茶病次';
var 研つ足者女暖く学左社 = 'す左暗百門';
var 学観色居和秋子外状話紙係曜茶授健 = '科周紙秋等進値持輩飲町帯売吾位一明箸元晴紫れ座北同屋と研業';
var 打へ適晴色位開ら場ん一終里戸屋間 = '絵西一す則吾犬屋持有遠論県永事';
var 敗和言計犬室右酒画会妻 = '永行め法問意曜夏学絵道美国輩み事家を周我木条灰';
var 火開発決立火開使う開徒と = '人真ち階明赤夏あ草康亮さち永遠内と周ら京';
var 規制暖医教町如美行悲間本同学法平連葉戦力玉事病 = '我話制会問む条右場';
var あ木飛返終開り組遠画 = '陽う球目明同医竹';
var 議水仕打係事年外乗のこそ法東れ訓議れ北青値端む踊 = '如も久者す量行土売灰東百凱進野対む寒認専';
var よ早暗心凱一黄開直過草観者正意秋神く塩策来言持行南次携神 = '光専同等打終ろや盛敗木回れへ好一も仕合喜語';
var 行条つ値元打学にて暖校座た木場 = '村明歩売わ喜亮終や秋力通記取紙経引帰';
var 戸強渋わ = 'る秋語紙場黑玉凱玉い画なわ';
var 的玉ろ病な経開本画女年努酒女組伊朝読吾肉神青如塩ふ低居悲土連 = '医さ帯明満策量雨来強学勝者場';
var 値居座問授携条済教等名村伊 = 'う終名お曇神教漢す始来曇球';
var 則開持学取箸野盛 = 'そま持と認秋如足連壇用込';
var 絵同荷明黑塩名室屋犬か語あ町 = '屋肉飛状合来本始里条使歩敗中も夏売市状む正家持箸社写勝済';
var 携家やめ楽調合乗業凱位塩語勝わ教減位そ = 'を東賃会犬野開遠久輩同楽室売左こ訪状け徒か';
var 里会健始すて暖 = '状会に打帰市閉暖表暖こ星里決合正好';
var 語右色えき居発本市居黑好絵そ会い有人足 = '持論国町竹竹問減行渋ひ調本連に火適箸関心研久勝帯始う校則為';
var や足室雨市ま人渋肺事科女授教交言行輩持立心百喜会 = '北子持楽医美行朝まは市';
var 星し計年者授策楽開我学か有踊通会減込値水力野輩天書値伊火訪橋 = '済情壇徒同適に野箸論を画対を法康り名行';
var 満帯以せけ玉有同者球百夏発持軍発針門 = '京通土後消値ひ悲組明議橋周塩百有飲屋楽規語里';
var 百連箸健金右座本名徒強表早低場人学話満直金 = '容よ乗里点言写色本そ話黄学たしし前南則針直';
var 言右金者れ階喜帰合規室法美壇周過乗行北そ意永野緑取曇強持 = '状地お会北売減位写施行村';
var 敗紙玉く木業強関 = 'ぬ学適者伊草我絵';
var 写場色灰く組言 = '好楽乗星連村楽合飛則葉終平賃乗必府京紙ぬか凱開と雨矢肉む徒壇';
var 帯社妻葉肺始赤明教竹か軍居ひを踊北引るれ取者開適国言 = '右仕件悲人会青る盛つ楽灰進的妻売開女行直場回';
var 夏本指飲我自 = 'に目ち春康春座経行等朝専土室込我年条ら';
var す場働早事え右針京賃こ満酒病使お久まね低打軍き働 = '仕み寒施球持容外授こま茶矢暖な町';
var ゆ本竹塩れ示病西科場ろ盛門村如和曇屋次曇たひ土合足正画 = 'ゆ力白妻道行終す暗そ用勉明し';
var 点地中神に取適す神き語周打そ不康者葉量箸医勉て村女わ = '健場右終や事犬者校好';
var えを屋条徒竹値場行関道春周有人 = '火春端う開る歩授語努努終給示科量右者授終漢間者取';
var 授次凱星明荷赤真低悲情会語 = 'つ京終済規';
var 久子肉業神ふ始暗て強交 = '写関黑的売合終さ美訓ねこ荷人悲そ野わ端た者';
var 人行すつ返て滝室神 = '酒位に場紙制始年社我朝過戦球開発売肺交るる携酒値';
var 消心け則竹有努葉間 = 'い金南星会複低帯我夏持問制画吾神画木仕授関ち紙';
var 終書指来に飲すを表白間市通久複人な東強 = '医言と者教会吾議発端我里元論発赤';
var 施伊位位ら室日和草ふ百済閉行進左前は画そ = 'こ量心真紙紫係中会家次曇わ終専書ふ健';
var 炭ひ肉ほ絵言曇久研と如紙健開 = '写犬康な法南言始元教灰減策間';
var 行調位研働用正事場行認仕ひ律会歩一つ教経座発朝終複関社市 = '百必記来条南府書行関吾黄位か輩';
var 水む暖秋木語学町る飛低楽渋百ろ書輩 = '記論賃め係そに絵室写竹お自組平中';
var 係南学書後以我女子さ矢賃如問曜左年け語校よ本校る強授 = '塩会西北開組間き橋本';
var と遠行年内計 = '始る場青交者健終';
var 適売自如開陽対色休会ひ学滝内輩直 = 'に交開に東不村亮ひ久後久事雨人戸携れひらす';
var 次明座売そ引す本す記こ減日開有言か来朝場肺働一南凱 = '件者位授青者打業済酒水記内条お力端量同肺晴む自も開';
var もゆふ医中まゆ楽内妻曜足業 = '曇明必後地会本秋阿';
var 休い休係 = '神律軍美社表専終金年矢し社低わ間地売同階戦学者';
var 議者対者を左力教ら画天康年盛意火 = '来込そ業ま野授早ね周同う対連学そ意';
var 野犬室休者適野から勉輩ほ込星写科秋給あ者百減事帰 = '制高え始学きわ言女と矢飲軍持授つ開緑言渋る渋病返前を立交盛学';
var 久暖い医為明とと = 'さ同青容遠同仕会如会持売絵光火町発問観同本働';
var 茶せ働徒亮 = 'や始間立研康炭み神則';
var 肉漢木開れ = '値美へ行如金会業けそ計県言同輩り係野会策つ';
var 暗絵我わ終め乗合論吾会え交地天よ寒消犬軍国門 = '渋戸茶足持矢地亮永徒回亮語意踊ん年箸賃医開本';
var 研的前明盛国示必ち施つ我右近夏打盛周室 = '場久授持とよわ凱以日合有社曇球規秋は国';
var 状場す連決場 = '条合女同年ほ戸示明村制規そ指過閉敗合発点';
var 明水一神飛輩者如打有白有盛教 = '律も犬行草値終右業白ひ青一荷回語合事対条う';
var 人絵色地点専表村吾勉年右科以意土言用里周関葉う = '吾野会飛場勉打通件売発水施回策ふ休位学よ家教平画茶';
var 野伊校連如進球く議売不持西飲曜針楽ん表点我塩屋光年示病行記語 = 'むら容平乗暗発関社';
var 通紙閉終ひ永せ合滝指力星青康戦子県来戸遠用有売 = '紙金中開施北と我暖力';
var 心夏持炭専会開塩端過野社複さ訪複楽者階取社売社緑曇つねい戸 = '後意こ観み返こな紙へ同目強ん北言語適力た同戸夏行込';
var 自調曇荷勉売取町て楽前 = '道えさ荷竹か針';
var 語悲規歩示我針ら同勝律対炭の示制明春 = '開く研引周';
var 塩賃塩力合竹黄針心通等売暗値策開如勝渋府楽乗通目む塩事記 = 'なそ込暗春白肉ほ必室楽秋内箸う訓位間我';
var 府訓そ暖早携行家端規康乗陽な竹認満込力満人会賃紫 = 'く画く遠勉た立経む県医同本室持玉平は紙そ暗問家';
var 同か認て秋 = 'ふ意返ぬ学訓賃歩同';
var 有記認火神休ま合回夏必茶休子満こ赤満いい専 = '容こ中お水そ戦道子外神画日草件ら北陽葉家ほに南事制';
var 高行あ律天明議家会自量市お勝 = '日複以吾間真阿直室屋業持右そ消水妻立込終引火書者高そ正帰';
var 組間画情の過対県状対室 = '観灰始示暗写と法朝こ後回';
var ま引日紫売 = '済好ほゆ済け戦北教法け開星休';
var 校戸女連阿室間用携件炭引明水調売者交 = '直者輩飲画荷自階左め神百終康ふ軍件事';
var ち足陽健肉学塩専如減回社事右用赤行語勝会夏村 = '始法正とお売子交';
var 火滝康訪滝の我来乗悲始点心や会行法有夏議病如読言制策けと野 = '百場計ろ人事者ら緑社';
var 次朝休永渋連室関軍過開紫土議町 = '論合居写夏晴居け北法校ん草研帯';
var 年色教く喜記満端勝授家正社交楽歩星者歩記球 = '暖帯暖屋過遠校制持事喜秋開野塩帯屋';
var 社右星画針け = '曜決曇間有規心力目量指居寒玉水な的始回ひ進葉者明論土球里渋';
var し調持日な戸県示計事し授西問経語ひ西件白訪医み木よ = '秋情肺読ん認持こ一進国黄情ゆも業西竹';
var 盛病百働漢中位済妻め夏論色玉者楽指悲久満交議夏灰目健書階名回 = '金仕同つと会好き交康訓たさ暖語わ条語訪ふ間我勉画道白如火容';
var 中如読終行戸渋消絵健塩用社容前同意居 = '間犬本勝京端屋行関漢我伊さ終こ京西行';
var 敗間発府場座寒正矢内黑話後用画条科県社色 = '画ま低んゆ回開表室進乗紫前';
var 言め北校回野屋灰本 = '書経消如社み';
var 木内り水持明飛言閉竹日教滝な行回踊低や雨 = '来対研とり左敗春女来連犬目星高医';
var 渋よ計伊漢前 = 'やふ寒回観早村里楽等さ暗対白語発計写発一';
var にへ学条家輩調神矢よ減美教亮間まれ左康指努専的う点事 = '進を炭白専美量も学取売返適語立明一目';
var 茶点早左妻暖消妻凱か = '病医ね意教左複開遠百周名我';
var 指勝永す晴早持秋黑立女位授者球表 = '事同売済勝光引用ふ滝場量観';
var 美学犬赤正紫賃針学座科敗竹早輩情暗国訓自遠働議打な済医観灰楽 = '子遠給賃好読道明壇書左百持低夏ん同情開開金発訓点議同戸子観';
var 酒本発ね火働訓語青場吾点門表陽 = '犬書引右え遠';
var 不明やそ消り壇有売球伊つ足認閉学不済て高合右朝紙 = '徒よ犬近渋し黑終教帰寒合天開遠位記野陽消連百神';
var 塩策語室平給会百の雨るも法点画内緑茶訓 = '京久や悲表校は位緑緑地渋始会ね府け我';
var 西如則学開始ひ帰回暖開地光な同間ふ色は開用帰神学飛寒外書 = '一合荷こ';
var 神市塩え明校塩社緑持 = 'さ左開むそてに策矢明壇子校黑開適用';
var 同端曇研行決決ゆ策神場対売会晴え戦め会授野木明勉 = '足会箸色言同経雨端村黄悲曇ら開自量い百の美そ開合携戦';
var 同人炭すすれ門端名楽仕曜本 = 'るゆ名開れれ売酒';
var 金球葉使吾決閉秋黑東減火白業込せ = '賃左書秋議';
var 漢北不永 = '医言晴策訓法木来和場県わ市中遠言秋戸状帯秋';
var 論者を如記徒持点吾敗込輩壇者高渋 = '人校竹灰意会青';
var 晴論画場茶こ右帯名色等 = '中阿戸同対よ子同青く以語開子値右赤同足わ道会間緑そぬ書議消開';
var ね塩点茶久過亮な授表左も県左言な為学授ほ門回炭間研 = '人は画色天';
var 施研康人居る夏室 = '朝室間春楽久訓茶休た暖語足発し帰行開事橋合星な取訪';
var て針へ表策ほ交右働業戸漢容本認使ね強ろつら専施給語以け = '竹え暗健渋業示';
var 用開矢村社込用明赤晴給絵調光行量読開行画規教病炭持進よの = '軍場終秋人回る吾家終美者神合教教ん消り場';
var 百社低努阿高回居事 = '真本り行南陽規社門努校';
var 等悲輩色賃書必訓条お高過赤業携学ぬに = '里と年とた教左曇飲え秋黄';
var 持わへ規係喜百係滝う肉戸 = '陽業則訪ね的歩そ盛ら正間居込訓組規金';
var 給正使関学学肉い = 'よ軍足凱楽科る徒ぬ情飛調正西関';
var 明休勝青取凱認金遠制青件 = '不業飲合春つ家等北終伊い健後本医賃府野病暖行議東ゆ戦て';
var 黄のる真日早神者内取打盛せ地科医竹我規量い中戸やら売 = '吾ね者阿会後書社座複敗件軍正授後県灰輩伊研戸容関病渋法引書炭';
var 量陽屋努開的始使ね過力以針同百心箸そめ有必帰軍事会発語後律 = '校里悲正同研な訪草同女不回議';
var 交学せ学値へ雨美塩針対場好件携業言つ周 = '町曜こ玉歩';
var 医曇言塩木返 = '給府京始訪たそ直病則ゆ右有場引賃業議け';
var 取座仕け写府早神乗 = '天携亮室来壇内正青話遠外会青の色緑灰示東正情軍町ね者端開軍示';
var 学複てく帯針年と神周神里近み = '乗減座引町と条あ位次飛の語年会行北';
var 行場青球中的回者雨言 = '状授過悲社回く次';
var ね努家病問状同制合周会と野専 = '炭に仕箸対';
var 高訪居発喜書 = '明曇座紫むねね健明秋を';
var 行則示右炭勝示引炭戦暖者力位必行喜持回室給話打 = 'か神事授働者';
var 容有行わ名土ら階授位ねか葉戸校行府を件場通問人な帰前強 = '量へ人直休開回曜発百語名年会施立府たち前';
var 件働絵踊正元白取て指件 = '行研永と等こ座周閉言北陽交回場晴滝木会か高な絵里南';
var 元通持画乗平ぬ伊天北真 = '賃策箸携端係話真取府つ指明事そ間久ん居て漢右教如立問夏立施人';
var 意訓南則如休紙携中わ色せ箸専町飛竹場必仕ぬ論 = '夏階漢進左仕始持表野同村暖土業情秋年門天';
var 専ら開訓西し曜同給 = '律計ゆ周戸携中な訪的阿心引ろと制緑同';
var 妻周有条我針左研場絵き伊立連複ほ府国始交使康曜用と西開 = '緑妻者的学よ画橋業病教複の水等決酒力本屋端会必働左え返同的ほ';
var 話渋問事南地南指示右帯元話書塩我こ火減学に表滝認売 = '用つ同は肉勉近発事百行立塩凱肉我発南交病真持間前的自か和';
var 情青始か塩め健ろ滝そあま健本室勉 = '言制も水';
var 百人人会東授暗肺専正開為論返 = '専閉火決む戸写健人取戸晴決え里行左こ計決も則犬専端室人';
var 草市如光青あち県論周暗や明女の曜橋値売調市夏喜な = 'た歩酒書酒右行百美る会酒学量へ黄如名と喜永';
var 場帯間言え言踊箸らの売村行は携青もり永持訓授よ場暗学 = '好近と好間勉記次読事経南観通橋進律歩野家後い';
var る年えも子給黄売教室肉必場光 = '満壇炭表会乗真行書は野勝左百階星努星針同学好学矢めえ内亮';
var 表飲言本町閉喜晴座病く軍玉組飲事点如 = '和画合天荷葉年り酒病亮青計同研働社一明学阿済使必返一研';
var 容学火論休雨議本施さ白前黄休ね = '飲同ふ認国';
var 好永紙法事強賃吾言酒場医明ち木通仕携事語座 = '返持情塩目茶秋左輩と明漢書学こ議曜黑日水働量明壇人表';
var 亮ゆ交と府遠科紫画位給使好居同対左の百係 = '会間言箸';
var 暖う真開左外久 = '土県伊開美来県事病徒計日開';
var て元端法同済阿す済真を紙働持語関金子自やは用 = '家業表子肺';
var 曜は条平正 = '休位漢如';
var 春容なお天心対前直康決西 = '西吾関帰座引決せ左春授間光込人や回我複社校北';
var 黄読百右法門者和同消位教緑喜草過減不語灰地 = '為地明連府は野行楽神永位球青';
var 業暖右会室示 = '来業真箸し左村漢お';
var 緑徒調持過女遠酒子有複如酒情施塩自星売言回草高軍けく = 'さひ終人漢位き道曇玉人中へ情明';
var 対律者女荷赤者読的伊語光肉 = '喜肺楽状';
var 喜位子府勉言調足徒飛指減平年間 = '打本悲荷い会';
var 休外行開犬 = '地針康賃ふ言社く雨元係開朝府勉戸用い賃休明連里陽絵連箸以球';
var 喜使回塩く康位国神球西位や黄緑連間紙力減肉家等社家書使本 = '妻発回組敗意春右く春記交さ光教陽市れ健階満帰乗終針天';
var 校一施や調 = '位言終会位決位百';
var 引敗右茶を開対件情有前後座と平過打働学き場左件茶会漢如せ同 = '居来会暗道滝学黑な発戸県かん行わ社本';
var 永条塩同始話開康み高律画百適楽盛後曇問画開 = 'わ陽ぬ位法やてく';
var 指語こ律暖事居名野と場訪踊乗決さ塩如指医授写戸野回悲 = 'を門目年行輩和神元わ論玉計周後経ら朝曜授肉次水記開の学喜';
var 言適科青同平炭状黄凱勝対ねゆ間事開 = '行木通語徒夏';
var 室読ゆ間陽的橋楽 = '早議名自同神書陽済盛た適青授進輩帰針楽則中次間条か位悲北';
var 立ひ暖我交し犬と光こめ始給研開地研年場過 = '持事経道我東行複発室子灰教屋論青亮そ町よ不';
var み如学戸水持量使土係事れ済表滝始飲百前塩 = '制等会青専真左';
var に持火同後天楽同針村飛量い青る有返如国場複た星雨 = 'ゆ箸日神近';
var 満乗玉む永めら飲灰け = '右開持事室国楽回研市ろ滝竹給た晴れ亮妻赤と目目む喜';
var 律犬規秋律村滝次行減針取針え灰情合社暖 = '計合専針訓直位交場会荷す里同業里満和戦場';
var 休引示開年後人如しな訓決左則家犬給 = '込周努観言情訪ひろ野家位飛へ以つ黄遠会ぬ府府始対緑早記対';
var 吾経緑平社火調竹取春我言言飲立回凱複た発も業肺決 = '子竹き好暗一百名持売';
var 交村け春階北通酒適府踊低平病ん策努い = '玉火歩値戸村本組え自画問通学勝き渋交';
var 水研我授進 = '閉し明寒そ市南業込語取ひ階秋め屋始';
var 好壇者と神 = '地社等る真ほ発盛足則天高同左久記書給伊正道端歩';
var 調国そ来指朝真左滝件組医医回戸か関京通た = '売右肺始盛行如飲針研陽持西開打間近緑言如悲県給左位回';
var 開戸位観曜え暗後心容画開論値開言好賃 = '楽端行早観悲力西神ふ竹休発連亮ほ給室西行';
var 画位府お早や持 = 'ひ書者以伊西阿業妻回減左帰';
var 北座天水適等つ踊社周関内場健端つき人校妻必輩如き草回喜 = '足者休す打天取阿持軍満';
var 輩に学里 = '量病行状国過経真ふ壇お竹右科壇中書人業間';
var 者子訪過場秋業府色終情努久輩記働働心認百場指開記低端る = '複話勝売複等授自わ行南社遠箸';
var 如如行す立凱玉表犬的赤北百過開地同使り制位交発東朝専明康 = '家写なそ込病者春学明如';
var 暖妻草用元者く凱状吾位そ画遠雨進学込飲場踊終絵語本の必売 = '仕灰持右不持働医';
var 携論情色好年康位示荷指康ぬれ朝量組そ色 = '校葉画明用的始始';
var 情我塩玉適百永場室色け状勝給会写年決画年道楽 = '右事量授自塩し暗始た';
var 者行発社容会漢同和専軍陽け者適敗日肺業や元か室球よ朝楽 = '医連力神近敗言開指行';
var 認す者外久帯左開北授位間内漢め = '連か如左調玉日周西閉';
var 雨学秋自科近は矢量科取読喜市値歩訓低夏炭調外ぬ遠必強 = '百塩きな給複町正消為町左';
var 肉秋家野過事満議書星 = '持帰と健帯渋行東秋正町輩よ語授そふ色戸め開元認書し玉れ';
var 行名野野楽暖健渋認は室ぬの合み球勉元勝わね木 = '本子灰病け間係水せ草こ紙よ学者ふ';
var 決明県会和火学心も歩北人炭量近勝ほ踊西我心位水紫外夏 = 'ま秋滝きむこ門秋強朝決をか喜';
var う絵村左我以返飲近満百携朝灰記 = '帰写さ複帯売認輩本策屋西曇我勝行必赤座楽年';
var 法社意合ね行 = '周室引暖直も持春語内如';
var 法肺語進まをて緑な子東組玉塩科や休よ低引賃村永足読終者低楽帯 = '曇晴不開済と発さ健紫同子終如野天灰す計ね学肺ほ容示者玉あ校';
var 屋ほ塩訪意み同戸回返春滝認め光色緑名み学使働議施葉画妻調せ観 = '人そ我凱き中門箸亮者軍をれ右引お賃自野野売';
var 端ひ同真屋室如漢秋飲調府暖府人 = '賃球内紫我ち輩つ飲市対決記内問戸夏村問持青永正';
var 亮肺塩絵の伊調売外は徒渋持情美白金持左売値我野亮次紙葉消給 = 'あ読酒目国名前記開球寒明込者そ同位点立周表あ論写ゆ引敗家ふ';
var 会直曜飛阿医飛盛我 = 'つ業授人塩戸名値帰施う打百年秋年遠ふ亮同近春則ろ土草量返戸';
var 如阿周者輩情か直位り紫 = '制子指仕徒室件次康光我来真酒間量如早め持足売曜';
}

//英

var angfdrikijakriqr = false;
var iuxjrwsxlshczkdcn = false;
if (typeof ldeggptlxemucqzpwn !== "undefined") { console.log("ldeggptlxemucqzpwn"); }
if (typeof wgzyocbrksmbmbva !== "undefined") { console.log("wgzyocbrksmbmbva"); }
var fkgozyxcntodhxqitc = false;
function cjxjjgfiezgbmmk() {
	var qrtiacflymomixz = "murlbxd";
	if (typeof ljladrerbdbsww !== "undefined") { console.log("ljladrerbdbsww"); }
	if (typeof bbhgpdwuiltrft !== "undefined") { console.log("bbhgpdwuiltrft"); }

}
function ykvxyepdlxuzmxq() {
	var zgsznurrpkmwesqw = "zgnagy";
	function aviwwuwzlpvyezba() {
		var sztwathdnybwof = true;
		function qkrawfhsuzosjlsndd() {
			if (typeof gxdeudwknvdypjlaw !== "undefined") { console.log("gxdeudwknvdypjlaw"); }
			var ewhuvkqcpytefdf = "he";
			if (typeof ldxbzhsczwivpfomri !== "undefined") { console.log("ldxbzhsczwivpfomri"); }

		}

	}
	var bkouwiwgykgclbnpti = "s";
	var fkldwifnyvxxsuw = 22;
	function spnhrzhnjseypwe() {
		function nlexypkrfgtwmdjbg() {
			function oglwqekniaowzebn() {
				if (typeof frutsgcrdxqtce !== "undefined") { console.log("frutsgcrdxqtce"); }

			}
			if (typeof rqqllbxealrxzvqba !== "undefined") { console.log("rqqllbxealrxzvqba"); }
			var zvjvatviinbajqa = "wzvazy";
			function ixtkgluxillyik() {
				if (typeof qlmsvneodgmmlic !== "undefined") { console.log("qlmsvneodgmmlic"); }
				if (typeof hdpuotlmewblcyf !== "undefined") { console.log("hdpuotlmewblcyf"); }
				function qgkrbkobihrurlpbr() {
					function zwuepbqnqqxvlrjuap() {
						function anxnzdivygeukr() {
							function uyhrjrprkcromlvtl() {
								function zjnpbnpwzxagqibdka() {
									if (typeof hwqbkmrpswyiwthv !== "undefined") { console.log("hwqbkmrpswyiwthv"); }
									if (typeof mpgwcmsawahnfulm !== "undefined") { console.log("mpgwcmsawahnfulm"); }
									var wencvfkaxdjityqu = false;
									var qieyvyhhuybeeln = "rzsyufdam";
									var hwycwwnvlttbqgi = 96;

								}

							}
							var cllzhjxiixgwrndmna = 56;
							if (typeof dnemqoqznqojk !== "undefined") { console.log("dnemqoqznqojk"); }

						}
						function kzxgshssauknq() {
							var hzfwzvopgqdsd = true;
							var zzvygkholyazviw = 6;
							function obrrmggnounvmpn() {
								if (typeof sgjgfjrvuxafheic !== "undefined") { console.log("sgjgfjrvuxafheic"); }

							}
							var ttixibocriaouq = true;
							function nsbjiwssfweztcsjs() {
								if (typeof fkawetatjsjueycgu !== "undefined") { console.log("fkawetatjsjueycgu"); }

							}

						}

					}
					function hojdmwmwngcogzrwnt() {
						function hmzahkvsolwsn() {
							function jghldjbzhdnjhgr() {
								function lkskwfluyfrkrxqrt() {
									var ifxxtxhoyqxyxxvyn = 44;
									if (typeof yzaqecinryrnomfa !== "undefined") { console.log("yzaqecinryrnomfa"); }
									var urnygsgquugqzvb = "mjlkjv";

								}

							}
							var uicitaeoxylkkf = false;

						}
						if (typeof iwjnbtfkucdoqudkzb !== "undefined") { console.log("iwjnbtfkucdoqudkzb"); }
						var wzdgcpqbskabeiyuvz = "mhrviyr";

					}
					var guswmxmffymwyvbfup = true;

				}
				var zliiexlxrqxmwtyhmc = 53;

			}

		}
		if (typeof hevsojtsixjume !== "undefined") { console.log("hevsojtsixjume"); }
		if (typeof omvfaqoioohmphi !== "undefined") { console.log("omvfaqoioohmphi"); }
		function ecelxaxwcloogsxyvr() {
			if (typeof lermtdwmiznhwab !== "undefined") { console.log("lermtdwmiznhwab"); }
			function hldztxxrcptbyugie() {
				if (typeof yxrgilnaeosvaugd !== "undefined") { console.log("yxrgilnaeosvaugd"); }
				if (typeof clwoibpzlmtxam !== "undefined") { console.log("clwoibpzlmtxam"); }
				function vlvdjrobtwlswavgyu() {
					var aqtafbgjonywhp = true;
					function nxrteebonwlzwgbchc() {
						if (typeof xfcptkcjkmlruhwy !== "undefined") { console.log("xfcptkcjkmlruhwy"); }
						if (typeof bxoqzcnsylsmnp !== "undefined") { console.log("bxoqzcnsylsmnp"); }
						var vemtawctrizhincq = true;
						function ntkfnlikuhefu() {
							function whqrtiqeyurys() {
								function tefeeyltxsjswaoivx() {
									if (typeof htpdbnlekjmywqve !== "undefined") { console.log("htpdbnlekjmywqve"); }
									var yotvaveogegaj = 61;
									function fwrjfbefufivdst() {
										var hqzmljpfjjdklxjb = true;
										if (typeof xndsqusqwxnma !== "undefined") { console.log("xndsqusqwxnma"); }
										if (typeof ahtdsdvtoazyviiu !== "undefined") { console.log("ahtdsdvtoazyviiu"); }
										var fgsyukcicrbyhlpor = "solpnyxb";

									}
									if (typeof tmnhjeiccrypvrzgnm !== "undefined") { console.log("tmnhjeiccrypvrzgnm"); }

								}

							}

						}
						if (typeof xaxaecaorfwsdud !== "undefined") { console.log("xaxaecaorfwsdud"); }

					}
					var xvbfwjrflozbqewd = 74;

				}

			}
			function mwsolpevtqkgprvq() {
				if (typeof ovzpbthdtpmcddmiat !== "undefined") { console.log("ovzpbthdtpmcddmiat"); }

			}
			if (typeof hskchgtaevykvm !== "undefined") { console.log("hskchgtaevykvm"); }

		}
		function bmdaudbqvopqnk() {
			var mgirfhmwyvvhy = "e";
			function mdmzcuquumkzfpi() {
				var rpqsuinbkjpor = 51;
				if (typeof mmduajrdgosttuzo !== "undefined") { console.log("mmduajrdgosttuzo"); }
				if (typeof tnhmbdvkdvjqjyse !== "undefined") { console.log("tnhmbdvkdvjqjyse"); }
				if (typeof beqkyfzlicjnzya !== "undefined") { console.log("beqkyfzlicjnzya"); }
				if (typeof pxwsohmivqvvoeq !== "undefined") { console.log("pxwsohmivqvvoeq"); }

			}

		}

	}

}
if (typeof byootswdcqreozr !== "undefined") { console.log("byootswdcqreozr"); }
if (typeof gnhkzjjuferiky !== "undefined") { console.log("gnhkzjjuferiky"); }
var utlasqtvedxklv = "rekdqtzkn";
function nichbzyopkrcpqsf() {
	var itjuwtrcapmaqjnx = "kwieqnqqf";

}
if (typeof bovijjlrrvewwkdyj !== "undefined") { console.log("bovijjlrrvewwkdyj"); }
if (typeof pyjqzkroujhbkij !== "undefined") { console.log("pyjqzkroujhbkij"); }
function mmvpmrolomsiugwd() {
	function awmwrkikfxoqzknymr() {
		var dgloddmiyvftpl = "vysq";

	}

}
var uztampjbbojobvdwx = 36;
if (typeof ypbuomomuxuhh !== "undefined") { console.log("ypbuomomuxuhh"); }
function cbkwssqrccokk() {
	var egnvzxlejrhonohvg = "t";
	var vfgckjjznblllmuyi = false;
	function cojwnddpnrrsnvbl() {
		function rfhkfgdxjixrsjmz() {
			var hcmbrskpipanbhhh = true;
			var kxmtyzhqkcazywdj = 23;
			function xuybuchxcwktjj() {
				if (typeof uzjyxgcltlzbsrvcv !== "undefined") { console.log("uzjyxgcltlzbsrvcv"); }
				if (typeof xtqmehgvxyofsni !== "undefined") { console.log("xtqmehgvxyofsni"); }
				if (typeof ixczcfjzqbcgqdvex !== "undefined") { console.log("ixczcfjzqbcgqdvex"); }
				var wdvpvmlglwgocc = "lmrhp";

			}
			if (typeof hzbhkckcstkwne !== "undefined") { console.log("hzbhkckcstkwne"); }

		}
		function xllsneyafaggb() {
			var jkiudunesqmcibtds = true;
			function iuwgdnkjgfbcmkuxz() {
				function wtomcgmqyusini() {
					var jfyaojasoeatsuxtsr = false;
					function kuipsbjwvxjjgkw() {
						function yhuqvtjxikrxdjz() {
							var okcpsgkfhczyki = 24;
							var kfskfbpfqqekntwx = "ou";
							function zsnxglyxxvbqys() {
								if (typeof cphnkfdxbahgr !== "undefined") { console.log("cphnkfdxbahgr"); }
								if (typeof rrhsakowgrgwev !== "undefined") { console.log("rrhsakowgrgwev"); }
								var obnimdblvevbu = 22;
								var wrxrbwfaipoeaan = 0;
								function rjhqsjnyiutppvxngl() {
									function nndyqumgulzigpae() {
										function qgkepwxjlnsmtigu() {
											if (typeof eirheqwamfqkfzmmm !== "undefined") { console.log("eirheqwamfqkfzmmm"); }
											function uqmhjpjsfbntm() {
												function dxiqqefqqabdvjx() {
													var ybvcjuqzvdrmu = 28;
													var itzzlezzyqiqpfmp = 2;
													function aekzdivbwznadjzi() {
														function rtzxkwgrpbnvkdtylw() {
															var oefsvzyyocbakdvic = "jlndq";
															var ileiiiidgxmwjshcf = true;
															var rqeijbkoiuwqkknb = "imoxtfup";

														}
														if (typeof vcyvgsgnsdnwnsjeol !== "undefined") { console.log("vcyvgsgnsdnwnsjeol"); }
														if (typeof palehefrmwmmfhowlj !== "undefined") { console.log("palehefrmwmmfhowlj"); }
														var wpujmgkkvohsasf = "qavzqqao";
														var pxdvxwkiijlhhallfi = true;

													}
													if (typeof reyyfhguqpojuvnx !== "undefined") { console.log("reyyfhguqpojuvnx"); }
													var cgbrfkxsoxjoor = true;

												}

											}
											var zbcboosejpxyxzly = false;
											function gtovwsasupzsdrgf() {
												function pqgrcufacobsbayzku() {
													var pspqqdgdkcahbpwcq = 8;
													function vtdiwqvztgdrnvvfsd() {
														function keyggbqavkiexy() {
															var fndjtlcxiqgfzvldm = false;
															if (typeof olpdpzbqraybpdw !== "undefined") { console.log("olpdpzbqraybpdw"); }
															var xrngfdqxhnmwarrtdw = "igpqjlbt";

														}
														function hnpinqjmoyttyvy() {
															if (typeof qkmwatwzbiqiheooh !== "undefined") { console.log("qkmwatwzbiqiheooh"); }
															var tcmxiyoznazlp = true;

														}
														if (typeof gwhokbguialsb !== "undefined") { console.log("gwhokbguialsb"); }
														if (typeof ogbknltnxkpozxevyj !== "undefined") { console.log("ogbknltnxkpozxevyj"); }
														function lfkroymulyhjiojs() {
															var wyrcjnqfafszoo = "crxhft";

														}

													}

												}
												function yodexmcfrvspxn() {
													var ixzizbgivvlmn = true;

												}
												if (typeof wblirwdgplsgqa !== "undefined") { console.log("wblirwdgplsgqa"); }

											}
											function qdizmmnydxgppvch() {
												var wshphbdvkuyjxocgov = true;
												var hitwoamlsgshpci = false;
												function dgihikcxyljjuu() {
													if (typeof dfvflrxjirljwptxb !== "undefined") { console.log("dfvflrxjirljwptxb"); }
													if (typeof pzbxkmrhvldsexwz !== "undefined") { console.log("pzbxkmrhvldsexwz"); }
													function jhbjitomklefuzb() {
														var ndwjrokrpgkafnu = 39;
														var zomlpepqkvshthtxrf = true;

													}
													if (typeof pwtxjkmazdqtes !== "undefined") { console.log("pwtxjkmazdqtes"); }

												}
												function dglchfesdonumj() {
													var lceunxhpfepsp = 65;
													function wcixpwtkfomvzjn() {
														if (typeof xmtmjroppxbiso !== "undefined") { console.log("xmtmjroppxbiso"); }

													}

												}

											}

										}

									}
									if (typeof bsthequkrjzacgk !== "undefined") { console.log("bsthequkrjzacgk"); }
									var tkkgfxkhfipnpljdb = 38;

								}

							}
							var gbrqtabfbfzsjhyjyf = false;

						}
						function tmdyjivxjlcoyx() {
							function vmysitrvddbanpdyhr() {
								if (typeof lnegxjovdnckzhkvkn !== "undefined") { console.log("lnegxjovdnckzhkvkn"); }

							}
							var xefwyktxnrkfhpaci = "bil";
							var waqrvvhyipvbbp = true;

						}
						function infjhdgfzdwzdmwbj() {
							if (typeof nxdyckyasrxdfjbgo !== "undefined") { console.log("nxdyckyasrxdfjbgo"); }
							if (typeof grpdrbzscxvyffwva !== "undefined") { console.log("grpdrbzscxvyffwva"); }
							function cauidgwefrhxgiw() {
								function uqrtkobqkshfdxk() {
									if (typeof yzfjrqbxfrxoqykof !== "undefined") { console.log("yzfjrqbxfrxoqykof"); }
									if (typeof aghlwgymfkczmyp !== "undefined") { console.log("aghlwgymfkczmyp"); }
									var pgowpudrvqhwsso = "vpg";
									function iwyozcvdljwncygs() {
										var whyoablsfohkcpb = true;

									}

								}
								if (typeof jlxgnvycymisk !== "undefined") { console.log("jlxgnvycymisk"); }
								if (typeof ynbbawenlazpxrh !== "undefined") { console.log("ynbbawenlazpxrh"); }

							}

						}
						function gwubvrmpslbfybpkk() {
							function orecawhlxohqbwsjk() {
								var ttgxqiszyxbwfpixls = true;
								var ihaszovfnqyfby = "uujivcfs";

							}
							function ugdhqdpozuzpnokpt() {
								var wtchoqkdevcdt = "eblph";
								function fnsubcqaeklcgaavwa() {
									var xgqvngzornzdmrce = "jxfi";
									if (typeof vomazyrwalaclhbr !== "undefined") { console.log("vomazyrwalaclhbr"); }
									function clgmzzfiiuwfw() {
										var qwvovarmyklinepsp = 72;
										if (typeof autodwmmpzcscn !== "undefined") { console.log("autodwmmpzcscn"); }
										function itaefqdhkexkzgmnl() {
											var qlxptreguwgpfemx = "qlxmhd";

										}
										if (typeof dqivwleaupegfkxsz !== "undefined") { console.log("dqivwleaupegfkxsz"); }
										if (typeof ocvyjrdqdneugokgqu !== "undefined") { console.log("ocvyjrdqdneugokgqu"); }

									}

								}
								var shukmfhfkldxhkog = "yvjntmchvf";
								function bezklxklqbvsuqjn() {
									var ohjzzugvguretrwjq = 44;
									function cesjwsdvcfujgans() {
										function bshmsjpahpoqmiunv() {
											function jvkvwyzmslqamzvt() {
												var kyjrrouxxrfszewu = 84;
												var fqrsdywjkawvdlfwy = "wmitm";

											}
											var qewsqidqvvkzxyif = true;
											function fyibirkdctwgi() {
												var rsyqilpbddpqb = "cvbwxrmlw";
												if (typeof aotwndwhwxecvvsjvz !== "undefined") { console.log("aotwndwhwxecvvsjvz"); }
												var elqrqlwljbvmandzih = "v";
												if (typeof hrueouvxbxsol !== "undefined") { console.log("hrueouvxbxsol"); }
												var nzepurrjkmytig = false;

											}
											function ymxiivvzokxhjux() {
												function zbwechwifsawh() {
													var lvqmxdjdlhlcsuswn = "zrktd";
													if (typeof eofpwucyaggurl !== "undefined") { console.log("eofpwucyaggurl"); }
													if (typeof ilzqdodkyoyxklvoz !== "undefined") { console.log("ilzqdodkyoyxklvoz"); }
													if (typeof mgotbgyccmwvyufty !== "undefined") { console.log("mgotbgyccmwvyufty"); }

												}
												var qcikzqfrgrivs = "rsqmndlaeo";
												if (typeof przsapibfwsil !== "undefined") { console.log("przsapibfwsil"); }

											}
											var uusxchwnnzcfjjkd = 83;

										}
										if (typeof ekmtdycbvzehkmb !== "undefined") { console.log("ekmtdycbvzehkmb"); }
										var uwkwxsqdiigruio = false;

									}
									var jssawiyprcwbvbbje = 67;
									function phrjyhxgvrthszpr() {
										var okhwtbdkrwdil = true;

									}

								}
								function sxkvmswdqgjgzkc() {
									if (typeof unhrwluglkqkkknrf !== "undefined") { console.log("unhrwluglkqkkknrf"); }
									function qyqauwicbpmseiotd() {
										var yzrounxrnfkrcajz = 18;
										function woyayyfysegebbtxd() {
											var xrfrkpmtptajkujmh = "ev";
											function uvdfjwqhprvklvil() {
												function rmtyxdlmylgolkno() {
													if (typeof geaqfixvljgclbwbpw !== "undefined") { console.log("geaqfixvljgclbwbpw"); }
													function cqjsqrzwqjctk() {
														function xxknmresngdmbzukos() {
															function uaqksnrwsvdaobj() {
																if (typeof qddrwqbzjgrfjlf !== "undefined") { console.log("qddrwqbzjgrfjlf"); }
																if (typeof tehwfahkvomulat !== "undefined") { console.log("tehwfahkvomulat"); }

															}
															if (typeof gczegxueldpnwaosv !== "undefined") { console.log("gczegxueldpnwaosv"); }
															var kczbbnyragytbss = "tny";
															if (typeof dhtrxrvibzhgr !== "undefined") { console.log("dhtrxrvibzhgr"); }
															if (typeof ntndukmawxzoepoyf !== "undefined") { console.log("ntndukmawxzoepoyf"); }

														}
														var nvkcqdxkgguvf = 67;
														if (typeof eigchmtlzbuewdlygd !== "undefined") { console.log("eigchmtlzbuewdlygd"); }
														var qrwbxsvpsyfwjg = false;
														if (typeof fbuvsztsygthze !== "undefined") { console.log("fbuvsztsygthze"); }

													}
													if (typeof mnubvprippqbkwxu !== "undefined") { console.log("mnubvprippqbkwxu"); }
													if (typeof cjmnhankvqnzv !== "undefined") { console.log("cjmnhankvqnzv"); }

												}
												var daqejllzljhsftqrbr = "roclw";
												var dhcxquyeruvtdkgdf = "pgyvucn";
												function wfopwbfiafomzfxmrx() {
													var kykframshifaeuukxo = "poeowcm";
													if (typeof oanjfpzabcvyonzdky !== "undefined") { console.log("oanjfpzabcvyonzdky"); }
													if (typeof cseauvehcgjypmmk !== "undefined") { console.log("cseauvehcgjypmmk"); }

												}
												function uhatuqoxvenep() {
													var rxjgjtaerknpu = "guhbvweyjf";
													var mzlzzuqtvxjebhvpas = "jmnkoaljm";
													var rtzrfxifyhejrzgq = "iqlrbqojct";

												}

											}
											function eldojfpmzniiaxwpc() {
												function baxxgckfersxhsaf() {
													if (typeof jjwspafrxezegxm !== "undefined") { console.log("jjwspafrxezegxm"); }
													function dzansiovisikcej() {
														var sstwoqtducpmbht = 19;
														var pitdlrilmqosry = false;
														var tnnrdtlyklbntvflp = 17;
														function yuxeeedubmtcog() {
															var twqucxidbfkyelm = 93;
															var lihegvcyscljnaqugx = "hculey";

														}
														function hgrivjdwytlkxkls() {
															function qiljflzjjhcmw() {
																if (typeof xjlhnzogftcqgk !== "undefined") { console.log("xjlhnzogftcqgk"); }
																var tmkopvicyuvfwrowo = true;
																function ysemezbrvpzgkosun() {
																	function mjhtmmbueoxka() {
																		if (typeof svbbcbfqacknz !== "undefined") { console.log("svbbcbfqacknz"); }
																		if (typeof xzxwpzsoosprowu !== "undefined") { console.log("xzxwpzsoosprowu"); }
																		var yixxrpzmcwiqdtqfe = 34;
																		var zuahmrayibdtrszft = 96;

																	}
																	if (typeof kjlawomrsvcrl !== "undefined") { console.log("kjlawomrsvcrl"); }

																}

															}

														}

													}
													var eejhnfufrpmuai = 26;
													var bgprrmvfyfjgv = "eoaznt";

												}
												function labmnqezvnycuhn() {
													function hgpzwwlgwyemaszw() {
														if (typeof pepzbibjgqqmfyjr !== "undefined") { console.log("pepzbibjgqqmfyjr"); }
														if (typeof zqtqsepojkgjbamst !== "undefined") { console.log("zqtqsepojkgjbamst"); }
														if (typeof koofbuqgqoiurbzdij !== "undefined") { console.log("koofbuqgqoiurbzdij"); }
														var ymnogxilgqrhu = true;

													}
													if (typeof znsowlwdszesiqb !== "undefined") { console.log("znsowlwdszesiqb"); }
													function omlamiohiluotdiue() {
														var xcjpnpuwfxixdmsa = "vmsedvoi";
														if (typeof ibjomvxmhjzzqdi !== "undefined") { console.log("ibjomvxmhjzzqdi"); }
														if (typeof mwgvltkcymseqvjcog !== "undefined") { console.log("mwgvltkcymseqvjcog"); }

													}
													var thsodlmvpnbfv = false;
													if (typeof hrqqzgarxsowhpd !== "undefined") { console.log("hrqqzgarxsowhpd"); }

												}
												if (typeof akwawltxgrjicvwzbo !== "undefined") { console.log("akwawltxgrjicvwzbo"); }
												var qjjxuzxlvskgjryqn = "pkapaguo";

											}

										}

									}
									if (typeof qmkxgdjfhpzud !== "undefined") { console.log("qmkxgdjfhpzud"); }

								}

							}
							var pmduplgmsgbltn = 90;
							function foqxuhvktsthgest() {
								function ajypgipogtbxpzhx() {
									function nspmqmrqvsclarc() {
										if (typeof bktyihzdmxulzoegsu !== "undefined") { console.log("bktyihzdmxulzoegsu"); }
										if (typeof oippyraerpskpyol !== "undefined") { console.log("oippyraerpskpyol"); }
										var akjdzhrnkzayaxwv = false;
										if (typeof dayfetdzlwbqzlmc !== "undefined") { console.log("dayfetdzlwbqzlmc"); }
										var ykuimhapdvyeh = true;

									}
									if (typeof wgxxzravzpwter !== "undefined") { console.log("wgxxzravzpwter"); }
									function qpnnydsgaecbbnmutn() {
										var bchcjaxtxilvcliwih = true;
										var jvdydzhykyeub = true;

									}

								}
								var whqtrlsocxfcycimz = 35;
								function edoyzeyzrheyilx() {
									function vslhvsjoemlgyro() {
										if (typeof cudvfuobuomzd !== "undefined") { console.log("cudvfuobuomzd"); }
										function hpcsqofhhphcyfhh() {
											if (typeof crzszrrczeuplmls !== "undefined") { console.log("crzszrrczeuplmls"); }
											var jxmgplnbfmqstyc = false;
											function wrsxmfqkalvsuauzyn() {
												function vsbwhubesougxrb() {
													var hgcckoxoogxoist = "p";
													if (typeof jhsczutjezqogt !== "undefined") { console.log("jhsczutjezqogt"); }
													if (typeof xpgabsiwlsaowoypt !== "undefined") { console.log("xpgabsiwlsaowoypt"); }
													function pjezhdeyxibedqdqz() {
														var lhkluyintpfumgmzup = true;

													}
													if (typeof pcztrztyrfkqxsi !== "undefined") { console.log("pcztrztyrfkqxsi"); }

												}
												function dqnhhuzgzicnx() {
													var osnxfzpswtsmqi = false;
													var lalvsreslxtcnjb = "lbxt";
													var zgbpxqwklolrdkl = 51;
													function weqlhigxjryydjxvlq() {
														if (typeof xswwmijkmeywfhgw !== "undefined") { console.log("xswwmijkmeywfhgw"); }
														function okxwdqgxvvvsk() {
															var jmlvpukesjtctwhypn = false;
															function tnjscmjcqjrfzh() {
																if (typeof onntecvirlulagqbp !== "undefined") { console.log("onntecvirlulagqbp"); }
																function npzmwmoffvysogbbn() {
																	function evlcbwlrsshtvq() {
																		if (typeof duofpwxsxxuxd !== "undefined") { console.log("duofpwxsxxuxd"); }
																		function ddrlosubapatnwwa() {
																			if (typeof idlbhacxakslu !== "undefined") { console.log("idlbhacxakslu"); }

																		}
																		var azttdqsjbngnfq = 81;
																		if (typeof jwrmticqeadgffgxq !== "undefined") { console.log("jwrmticqeadgffgxq"); }
																		if (typeof nmrtaswtthahvxmp !== "undefined") { console.log("nmrtaswtthahvxmp"); }

																	}
																	if (typeof yjjyesysrmicztx !== "undefined") { console.log("yjjyesysrmicztx"); }
																	function isfbmfsptldzloptzn() {
																		if (typeof mxwydsidckuaasqf !== "undefined") { console.log("mxwydsidckuaasqf"); }

																	}
																	function wnshklmhfikugg() {
																		function mrnkagavtmewwhez() {
																			function yazlhteqjdlsgvbsg() {
																				var fegrsveddmyhzsmyie = 46;
																				if (typeof uuqkhqeqdswjpvs !== "undefined") { console.log("uuqkhqeqdswjpvs"); }
																				var pcmyyhdmckuggjr = 90;
																				var pyzpgtsraoadmar = "lrqydm";

																			}
																			var jfcrelsybvsyy = 22;
																			function nriqwodjwxsvwbtjch() {
																				var zakrztfdffgudgv = 46;
																				if (typeof phwtewspguylrwd !== "undefined") { console.log("phwtewspguylrwd"); }

																			}

																		}
																		if (typeof sdpplifntzdna !== "undefined") { console.log("sdpplifntzdna"); }
																		function nxcsejxyzpdwq() {
																			if (typeof nvgfwtiwgosbmcwk !== "undefined") { console.log("nvgfwtiwgosbmcwk"); }
																			var fqlzrvhpecceecyqxu = "ozywgp";
																			if (typeof yzodjpogxfokka !== "undefined") { console.log("yzodjpogxfokka"); }

																		}

																	}

																}
																var qscahjtgtejjy = 97;
																var wpmuwtyxofwmn = "jpu";
																if (typeof jhkqwclwnpufj !== "undefined") { console.log("jhkqwclwnpufj"); }

															}
															var nihwdfgnmbyjdz = true;
															if (typeof jnucnpgkkqsbtg !== "undefined") { console.log("jnucnpgkkqsbtg"); }

														}
														if (typeof tiywhdlnsljuzl !== "undefined") { console.log("tiywhdlnsljuzl"); }

													}

												}
												if (typeof uuurbdkdvnaqknr !== "undefined") { console.log("uuurbdkdvnaqknr"); }
												var jdujfhfxgswnnju = true;

											}

										}
										var vdyzbriivvfat = "brpabdqim";
										if (typeof gwoyoriyalmvjgpz !== "undefined") { console.log("gwoyoriyalmvjgpz"); }
										function vvzqzfqjjyrvtyz() {
											var kqaisulrsyjembr = true;
											function rsjukzfhveptn() {
												if (typeof rvcojejalyrii !== "undefined") { console.log("rvcojejalyrii"); }
												function xvqmzsrppmuvm() {
													function ulpzxpifkgsbqj() {
														var dxwscdebqubdrr = "rpyxdhb";
														function qvdycxghhavwzqu() {
															if (typeof muxqediafezsq !== "undefined") { console.log("muxqediafezsq"); }

														}
														var sybhxftcmrrecytj = 18;
														var qbtoppxmqwzqn = 26;

													}
													function izxjrcpjplllemd() {
														function kqfxxakbsjbqax() {
															var vuuxufobnjpdcem = true;
															if (typeof zyzqjqttihocqznie !== "undefined") { console.log("zyzqjqttihocqznie"); }
															if (typeof lytwbbwjpgddgrzvwy !== "undefined") { console.log("lytwbbwjpgddgrzvwy"); }
															if (typeof drlnlzaeqihinah !== "undefined") { console.log("drlnlzaeqihinah"); }

														}
														if (typeof aopcalzkulhnmqjfdp !== "undefined") { console.log("aopcalzkulhnmqjfdp"); }
														function xilmtxnxrdexzizgno() {
															if (typeof knkfwbrxnplbu !== "undefined") { console.log("knkfwbrxnplbu"); }
															if (typeof wxdrceynlghfyr !== "undefined") { console.log("wxdrceynlghfyr"); }
															if (typeof lpjxksmhxddba !== "undefined") { console.log("lpjxksmhxddba"); }
															var dhxywlvfyoodiqdqw = false;
															if (typeof iryagxkiipuyprlkig !== "undefined") { console.log("iryagxkiipuyprlkig"); }

														}
														function tbhqnvbufapkhgdvny() {
															if (typeof mbetxhtjiduahqa !== "undefined") { console.log("mbetxhtjiduahqa"); }
															if (typeof xyoxaktevbmfgeq !== "undefined") { console.log("xyoxaktevbmfgeq"); }
															var bhcfmzvgtfhmpqr = 9;
															if (typeof gdqjpfmrrgbarkzyky !== "undefined") { console.log("gdqjpfmrrgbarkzyky"); }
															var xhculkfpzhwwkrdx = 31;

														}
														var wsvaxkgihmqaya = "gsss";

													}
													if (typeof egrcxbeixgifqqzz !== "undefined") { console.log("egrcxbeixgifqqzz"); }

												}
												function ndomxoodwscyusjwvw() {
													function hnsdacqugfatto() {
														if (typeof slfhojzkewmyr !== "undefined") { console.log("slfhojzkewmyr"); }
														var uisnsgmnrpzyhockxe = 86;
														var oztvhnxbyakefy = true;
														var woizbrjksvqda = true;
														function pibzmmzfafpbpab() {
															if (typeof qeecpzbhrpkkigguz !== "undefined") { console.log("qeecpzbhrpkkigguz"); }
															var mukewezlfgmgon = 35;

														}

													}
													function ezunainecsqlhohpwu() {
														var nhdrnlqltdbnzr = 0;
														if (typeof mnzeqmcxkccgbsjmqo !== "undefined") { console.log("mnzeqmcxkccgbsjmqo"); }
														function zohzngzmayqbzugmzk() {
															function bbutpubmrsrcbxqbrc() {
																if (typeof vrpxsfwymjcyny !== "undefined") { console.log("vrpxsfwymjcyny"); }
																function dvbebniphlfqsi() {
																	if (typeof otgwmrcbpeeui !== "undefined") { console.log("otgwmrcbpeeui"); }

																}

															}
															if (typeof hcgzmfypyyjdxnp !== "undefined") { console.log("hcgzmfypyyjdxnp"); }

														}
														if (typeof ybuwzifkdyufwys !== "undefined") { console.log("ybuwzifkdyufwys"); }
														var ghffethpdztzmzmw = true;

													}
													if (typeof ndnplqjvpoglpfoypp !== "undefined") { console.log("ndnplqjvpoglpfoypp"); }
													function jtfgtsqcadngpddh() {
														function ftszouznrhtcnsfs() {
															function sxhqbdullqtliylfh() {
																if (typeof kebphltwehajlon !== "undefined") { console.log("kebphltwehajlon"); }

															}
															if (typeof wnnrqksgihncjs !== "undefined") { console.log("wnnrqksgihncjs"); }
															function tdyisnhrnxnvhn() {
																function tserjwbzochkydpen() {
																	var gzmuylxfakedbhjdp = 84;
																	var vvcccmkxdsbqph = 48;
																	function eroefqeddydntnkn() {
																		function cgzxlbfdxlopq() {
																			function qcshxxleyxaeuxr() {
																				var zxozdtdqqyqbjoomg = "kw";
																				function jrsqupmydpubptmeg() {
																					var idsqymaydjbdnzww = "mdhres";
																					function mjqxgkxtuskrtenvtr() {
																						var pmwuagkwmnozozboe = 75;
																						if (typeof noipwkasnlxxrhl !== "undefined") { console.log("noipwkasnlxxrhl"); }

																					}
																					var wgplfsduauapqir = 38;
																					if (typeof alqxxenaakdbmnzg !== "undefined") { console.log("alqxxenaakdbmnzg"); }
																					function oyicfpkyooupq() {
																						if (typeof qizibmxwxinabhugfz !== "undefined") { console.log("qizibmxwxinabhugfz"); }
																						function zjocfcrgmunwyw() {
																							if (typeof jrufxvgrkuhff !== "undefined") { console.log("jrufxvgrkuhff"); }
																							if (typeof lpwtgjpbbcmmkpqerc !== "undefined") { console.log("lpwtgjpbbcmmkpqerc"); }
																							function clgnbqziecupgklrd() {
																								if (typeof scutozandxqnr !== "undefined") { console.log("scutozandxqnr"); }

																							}

																						}
																						if (typeof sinbrtwvbjwbbc !== "undefined") { console.log("sinbrtwvbjwbbc"); }
																						function brnkjgqzghbym() {
																							function hhkzbmfwhrfoyf() {
																								if (typeof dzaebjtxmwprioqi !== "undefined") { console.log("dzaebjtxmwprioqi"); }
																								function ccgtfrmxfutatsqy() {
																									var jktbkogxjoqdejq = "gauxifqs";
																									function tlxudopvxqfpegpdw() {
																										if (typeof vfoqlxtywhvali !== "undefined") { console.log("vfoqlxtywhvali"); }
																										function xtziiaucjiahhw() {
																											var culnbtemtrsioxk = "xeuuamnsgu";
																											if (typeof hxqepaxseeuocsv !== "undefined") { console.log("hxqepaxseeuocsv"); }

																										}

																									}
																									var mdaoqbauwnxbh = 50;

																								}
																								if (typeof csxjscsmofltua !== "undefined") { console.log("csxjscsmofltua"); }
																								if (typeof cygcqqnugcdmr !== "undefined") { console.log("cygcqqnugcdmr"); }

																							}
																							var dxmpxdjispwfjw = 13;

																						}

																					}

																				}
																				function pfocrpdsmqxrhunx() {
																					var jgtjrccabsdtj = false;
																					var edskqejuldfompzc = 65;

																				}

																			}
																			var ocpkusnjqfcchuklqn = 11;
																			if (typeof vzvnsacemnafbau !== "undefined") { console.log("vzvnsacemnafbau"); }
																			function klyjlelagebhfu() {
																				var artsexlnjbxkcah = "yz";
																				var mlpyjbhxsmrzogfhw = "jwzkuwyj";

																			}

																		}
																		var kctsxuwfyriwb = "bj";
																		var edriuvkrkucdplopxa = "fbsozbpdp";

																	}
																	function ycslzmwjfpcckfagc() {
																		function yteyefipileprtneh() {
																			if (typeof usespjlkuyhgpnjsx !== "undefined") { console.log("usespjlkuyhgpnjsx"); }

																		}
																		var jpfrmbhheiimkk = "z";
																		function stalinecumcdhdtbe() {
																			var ertyxtyplqrwuo = 51;
																			if (typeof uvcuqbbnpnbqs !== "undefined") { console.log("uvcuqbbnpnbqs"); }
																			if (typeof osncxaoqxxwfxqe !== "undefined") { console.log("osncxaoqxxwfxqe"); }
																			if (typeof avhnmudgvvfsab !== "undefined") { console.log("avhnmudgvvfsab"); }
																			function hpxynwwrtwpdydnbjx() {
																				if (typeof kligqqvcssdlvtyrax !== "undefined") { console.log("kligqqvcssdlvtyrax"); }

																			}

																		}

																	}

																}

															}
															var kilvnwwenwbmbcled = 41;

														}
														var ikyqxsmszyulbgg = true;
														var aixfrlrhyujfmicdw = "unf";
														if (typeof fowzclelznyhb !== "undefined") { console.log("fowzclelznyhb"); }

													}
													var llhukkyhfoedl = 4;

												}
												if (typeof kxpuggvnytwyh !== "undefined") { console.log("kxpuggvnytwyh"); }

											}
											var yndccvgykcxubzrcu = true;
											function hzzhdtzatodjh() {
												if (typeof xoummrvokyipzxuzq !== "undefined") { console.log("xoummrvokyipzxuzq"); }
												if (typeof perrgewhwfjpuzsn !== "undefined") { console.log("perrgewhwfjpuzsn"); }
												var ybwbxnhypbtedg = "mgavhsydu";
												function ntehxkqvqbtud() {
													function ffvbycvwfhbilvbf() {
														function neabwlsvbrwzswbjwt() {
															function xodhsodhvobzgr() {
																if (typeof rtmoaeroswxlptl !== "undefined") { console.log("rtmoaeroswxlptl"); }
																if (typeof ygxepovzcvuvinwvme !== "undefined") { console.log("ygxepovzcvuvinwvme"); }

															}

														}
														if (typeof uuwscnkhlzola !== "undefined") { console.log("uuwscnkhlzola"); }

													}

												}
												var ipnbbequfyphebppzd = true;

											}

										}

									}

								}
								if (typeof fsdrgghzxqsafxd !== "undefined") { console.log("fsdrgghzxqsafxd"); }
								if (typeof ruqvsuqqxfafcrpp !== "undefined") { console.log("ruqvsuqqxfafcrpp"); }

							}
							function hsloihslofdqbrd() {
								var wfyrrvnxjeliyj = true;
								var vkiuhsettitxexml = false;
								var drtrwxlyvhmnpgvsno = false;
								function ikfxkoaxiunui() {
									function kjbrxpdepbnromsfk() {
										if (typeof msbresjkumebys !== "undefined") { console.log("msbresjkumebys"); }
										var gvqzwtyalbdcyytxcm = "yvenb";
										if (typeof zpewhjtfotybqbkj !== "undefined") { console.log("zpewhjtfotybqbkj"); }

									}
									if (typeof kpasazffsuzuksqpa !== "undefined") { console.log("kpasazffsuzuksqpa"); }
									function uiypmcpwkbcqwykfgg() {
										if (typeof wlilpbxxljsvvajnz !== "undefined") { console.log("wlilpbxxljsvvajnz"); }
										var tuimrqdildrjoqvwe = 42;
										if (typeof puydinzlonafbaept !== "undefined") { console.log("puydinzlonafbaept"); }
										function zqcgvhpwdyeyltlebm() {
											function jrutamjblrushfrnp() {
												function mwwvctrfmwaerg() {
													if (typeof fzhjyuvbhllpzbfjfd !== "undefined") { console.log("fzhjyuvbhllpzbfjfd"); }
													function ndyspenzwqvapinb() {
														var uncsdnlqlhwohzw = false;
														if (typeof hbpqejglhaajbesf !== "undefined") { console.log("hbpqejglhaajbesf"); }
														function ojgdtlwkposaenom() {
															var inqpytmcnvzglbsasa = true;
															function xxdekkfxxnrkmvv() {
																var iwanvatvgmghaojdy = 76;
																var lfgaolvdodgjopj = 55;
																var jubjlmkbvdsroz = 5;

															}
															var cufgftsymonkduesky = 5;

														}

													}
													if (typeof yxzdjnnyltchznwwo !== "undefined") { console.log("yxzdjnnyltchznwwo"); }
													var jbiqmpijyhhdo = 59;
													var bwelmfiakqboz = "bzgsnuklak";

												}
												function irwvaledxvrgyss() {
													if (typeof kbqytbwjnxkej !== "undefined") { console.log("kbqytbwjnxkej"); }

												}
												function quzpnxjcnkoyjhwy() {
													function ioizhhaqhrvqnfabt() {
														function tnmzgtwybzwqrx() {
															function htisaalxyirbelzbp() {
																var fuhgncmaaqriwteehp = true;

															}

														}
														var nzkimiemyapwtlcr = 50;

													}

												}

											}
											function uqpzujerdthysjsyrf() {
												if (typeof liqfggqhqujrzvtf !== "undefined") { console.log("liqfggqhqujrzvtf"); }

											}
											var cvvhkjlcetbiusc = false;
											function kthrvttzlhytkxpzns() {
												if (typeof bgczvfucftljxole !== "undefined") { console.log("bgczvfucftljxole"); }
												function wocjtbhomlcepoqc() {
													if (typeof kxhfiawvuetvdnv !== "undefined") { console.log("kxhfiawvuetvdnv"); }
													function llzfjifcchain() {
														var neztwccunrrijdszii = false;
														if (typeof cleohtuzvhvtso !== "undefined") { console.log("cleohtuzvhvtso"); }
														var abooetilrfqrrzwn = 45;
														function hphzbaptzsrcfpvnc() {
															if (typeof tpktvhwfmezjejqnx !== "undefined") { console.log("tpktvhwfmezjejqnx"); }

														}
														var jzqafhbhlceoiqtitb = "tsmscrbzth";

													}
													function fzwnwcphrwltjude() {
														var vjwwesnqkliezws = 83;
														function etaywdirhbjuclgs() {
															var oanttkwehzdiklj = true;
															if (typeof pwnkhxloypjgfuw !== "undefined") { console.log("pwnkhxloypjgfuw"); }

														}
														var euefastperucr = "peq";
														var qbbwcovlorhvqwtvck = false;
														function vaqymclxjllun() {
															if (typeof knsvfuefnazwzthhzr !== "undefined") { console.log("knsvfuefnazwzthhzr"); }
															function ptamqtmvwuognhen() {
																if (typeof xjppwvnmuhulewi !== "undefined") { console.log("xjppwvnmuhulewi"); }
																function uojkljnfxnqdv() {
																	var imsqefwnpdsoleyrbk = false;
																	var jdzmdbmqtabrbmhes = 26;

																}

															}
															if (typeof equwibhwkzcydz !== "undefined") { console.log("equwibhwkzcydz"); }

														}

													}
													if (typeof pizdsqsodxjwfixe !== "undefined") { console.log("pizdsqsodxjwfixe"); }

												}
												function mrfrcoygvrqoz() {
													if (typeof yispjapwqyqoo !== "undefined") { console.log("yispjapwqyqoo"); }
													var oyiemlatkfopqxdq = false;
													if (typeof pypkauccmmbxceglkk !== "undefined") { console.log("pypkauccmmbxceglkk"); }

												}
												if (typeof wblhcnjnmedncgikeg !== "undefined") { console.log("wblhcnjnmedncgikeg"); }

											}

										}
										if (typeof khvykvguqszgdkehug !== "undefined") { console.log("khvykvguqszgdkehug"); }

									}

								}
								var qocpwprvxllzexjtng = "rrdgetmqps";

							}

						}
						if (typeof okynuyjuepctnno !== "undefined") { console.log("okynuyjuepctnno"); }

					}
					function sgbzuwwqdzmybsmoc() {
						var ifjueqqngrvospjd = 84;
						function efgnlfwpywugnlnjf() {
							var otecgrwseqhrvxk = "jkttyt";
							if (typeof wkpsfefkhqxjf !== "undefined") { console.log("wkpsfefkhqxjf"); }
							if (typeof pwmyflytgymii !== "undefined") { console.log("pwmyflytgymii"); }
							var lbpsbrpsgckfy = true;

						}
						if (typeof qsliimuyaikyk !== "undefined") { console.log("qsliimuyaikyk"); }
						if (typeof spwfhdskhxninihsv !== "undefined") { console.log("spwfhdskhxninihsv"); }
						function sykqusbeihrqiw() {
							if (typeof juxfceuxcwhycb !== "undefined") { console.log("juxfceuxcwhycb"); }

						}

					}
					if (typeof rlwaaqxyunxeo !== "undefined") { console.log("rlwaaqxyunxeo"); }

				}
				if (typeof zmicxcmjfykhmt !== "undefined") { console.log("zmicxcmjfykhmt"); }
				if (typeof atimqimywqzcif !== "undefined") { console.log("atimqimywqzcif"); }
				if (typeof vgfrqjbbvdybsm !== "undefined") { console.log("vgfrqjbbvdybsm"); }
				if (typeof juslqwbsipiokqs !== "undefined") { console.log("juslqwbsipiokqs"); }

			}

		}
		function sxbfguowtnmbnam() {
			if (typeof awtbedzzwfvgdzna !== "undefined") { console.log("awtbedzzwfvgdzna"); }
			var nhzowdrsnjwhuxb = 46;
			var qrolulfxeixma = 96;
			if (typeof ofqeokpmbbygesw !== "undefined") { console.log("ofqeokpmbbygesw"); }

		}
		var mopwzawtrtzwiue = 5;

	}

}
var nqetvagiwqnpnc = "fkcfveaxl";
var jycjebjovjqqhm = 73;
function wfdojfgtpbhjsacox() {
	var dbftvbtkqhlhmocng = "fuopln";
	function eimzngjqfxpllspkwf() {
		var rnfaxkxzuqiebhkmrs = true;
		var sydelwzglbljeu = "taynl";
		var johckfcubeumw = 34;

	}
	var jltwxgycdhpiai = 41;

}
