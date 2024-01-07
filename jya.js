/* 
This tool made by AAAAAAAAAAAA.
Made at 2023/12/06.
Update at 2024/1/08.
ver β1.8.
 */

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
			var ip = data.bid;
			var u_id = data.uid;
			html += '<div id="' + id_head + data["seq"] + '" class="comment clearfix" >';
			html += '<div class="l">' + img_users_pict(data.uid, data.img_no) + '</div>';
			html += '<div class="r">';
			html += '<div class="comment_head"><span class="m_no">' + data["seq"] +
				'</span><span class="m_uname">' + name + '</span><span class="m_time">' +
				date_f(data.time) + '</span><span class="at_uname">　 ' + ip +
				'</span><span class="m_time">　 ' + u_id + '</div>';
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

//https://i.imgur.com/5RYLbU1.png 一時休止

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
					data.img_no + "　アカウントID:" + data.uid + "　IP:" + data.bid + "\n投稿:\n" +
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
						name = data.character_name + '<span class="at_uname">@' + name +
							'</span>'
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
				var ip = data.bid;
				var u_id = data.uid;
				html += '<div id="' + id_head + data["seq"] +
					'" class="comment clearfix" >';
				html += '<div class="l">' + img_users_pict(data.uid, data.img_no) +
					'</div>';
				html += '<div class="r">';
				html += '<div class="comment_head"><span class="m_no">' + data["seq"] +
					'</span><span class="m_uname">' + name + '</span><span class="m_time">' +
					date_f(data.time) + '</span><span class="at_uname">　 ' + ip +
					'</span><span class="m_time">　 ' + u_id + '</div>';
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
