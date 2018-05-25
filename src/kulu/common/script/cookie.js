function setCookie(name, value, saveTime) {
	try {
		if (saveTime == null) {
			saveTime = 60;
		}
		var exp = new Date(); // new Date("December 31, 9998");
		exp.setTime(exp.getTime() + saveTime * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires="
				+ exp.toGMTString() + ";path=/";
	} catch (ex) {
	}
}
function getCookie(name) {
	try {
		var search = name + "=";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = document.cookie.indexOf(";", offset);
				if (end == -1) {
					end = document.cookie.length;
				}
				return unescape(document.cookie.substring(offset, end));
			} else {
				return "";
			}
		}
	} catch (ex) {
		return "";
	}
}
function delCookie(name) {
	try {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null) {
			document.cookie = name + "=" + cval + ";expires="
					+ exp.toGMTString() + ";path=/";
		}
	} catch (ex) {
		return null;
	}
}
