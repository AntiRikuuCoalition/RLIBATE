const cssCode = `
body#body {
	font-size:12px;
	color:#333333;
	line-height:1.7em;
	background: linear-gradient(to bottom, black, black);
	padding:0;
	margin:0;
	overflow:hidden;
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
