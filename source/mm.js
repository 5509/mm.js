/*
 * mm.js
 * use for iOS (and Android(not tested))
 *
 * @license  : The MIT License
 * @author   : nori(http://5509.me/)
 * @modified : 2011-04-13 18:19
 */
;(function(window, document, undefined) {
	window.mm = mm || {};
	/*
	 * Common constructor
	 */
	function mm() {
		var _a = arguments;
		function F() {
			var i;
			this.identifier = "mm";
			if ( typeof _a[0] === "object" ) {
				this.elm = _a[0];
				return;
			} else
			if ( _a[0].indexOf("#") !== -1
			&& /^[#\w\-]*$/.test(_a[0]) ) {
				this.elm = document.querySelector(_a[0]);
				return;
			}
			switch ( _a[0] ) {
				case "body":
					this.elm = document.body;
					break;
				default:
					this.elm = document.querySelectorAll(_a[0]);
					break;
			}
			this.length = this.elm.length;
			if ( this.length < 1 ) return;
			if ( this.length === 1 ) {
				this.elm = this.elm[0];
				return false;
			}
			for ( i = 0; i < this.length; i++ ) {
				this[i] = this.elm[i];
			}
		}
		F.prototype = mm.prototype;
		return new F();
	}
	/*
	 * return DOM element(s)
	 */
	mm.prototype.get = function() {
		return this.elm;
	}
	/*
	 * each method
	 */
	mm.prototype.each = function(func) {
		var i;
		for ( i = 0; i < this.length; i++ ) {
			func.apply(this.elm[i], ([i]).concat(arguments));
		}
		return this;
	}
	/*
	 * addKlass
	 */
	mm.prototype.addKlass = function(token) {
		var _elm = this.elm,
			_thisClass = _elm.className;
		if ( this.containsKlass(token) ) return this;
		if ( !_thisClass || _thisClass.length === 0 ) {
			_elm.className = token;
		} else {
			_elm.className = _elm.className + " " + token;
		}
		return this;
	}
	/*
	 * removeKlass
	 */
	mm.prototype.removeKlass = function(token) {
		var _elm = this.elm,
			_thisClass = _elm.className,
			_thisClassSplit = _thisClass.split(" "),
			i;
		if ( !token || token === "" ) {
			_elm.className = "";
			return this;
		}
		if ( !this.containsKlass(token) ) return this;
		if ( _thisClass === token ) {
			_elm.className = "";
			return this;
		}
		for ( i = 0; i < _thisClassSplit.length; i++ ) {
			if ( _thisClassSplit[i] !== token ) continue;
			_thisClassSplit.splice(i, i+1);
			break;
		}
		_elm.className = _thisClassSplit.join(" ");
		return this;
	}
	mm.prototype.containsKlass = function(token) {
		return this.elm.className.indexOf(token) !== -1;
	}
	mm.prototype.toggleKlass = function(token) {
		if ( this.containsKlass(token) ) {
			this.removeKlass(token);
		} else {
			this.addKlass(token);
		}
		return this;
	}
	/*
	 * css method
	 */
	mm.prototype.css = function() {
		var _a = arguments, i, hash, val,
			elm = this.elm;
		// 引数ない場合はgetComputedStyleを返す
		if ( !_a[0] ) {
			return getComputedStyle(elm);
		} else
		// 引数ある場合
		if ( !_a[1] ) {
			// オブジェクトで渡された場合
			if ( typeof _a[0] === "object" ) {
				hash = _a[0];
				for ( i in hash ) {
					if ( !elm.style[i] ) {
						continue;
					}
					elm.style[i] = setPx(i, hash[i]);
				}
			// 引数あるけど第二引数ない場合は指定プロパティを返す
			} else {
				val = getComputedStyle(elm)[_a[0]];
				return val;
			}
		// 単体指定
		} else {
			elm.style[_a[0]] = setPx(_a[0], _a[1]);
		}
		// pxが抜けていてかつpxが必要なtypeにはpxを付加して返す
		function setPx(type, oldVal) {
			var newVal = "undefined";
			if ( type.indexOf(".") === -1
			&& !/opacity|zIndex|zoom/.test(type)
			&& /^\d*$/.test(oldVal) ) {
				newVal = oldVal + "px";
			} else {
				newVal = oldVal;
			}
			return newVal;
		}
		return this;
	}
	/*
	 * attr method
	 */
	mm.prototype.attr = function() {
		var _a = arguments, val, i,
			elm = this.elm;
		if ( !_a[1] && _a[1] !== 0 ) {
			// set multi
			if ( typeof _a[0] === "object" ) {
				for ( i in _a[0] ) {
					elm.setAttribute(i, _a[0][i]);
				}
			// get single
			} else {
				val = elm.getAttribute(_a[0]);
				return val;
			}
		// set single
		} else {
			elm.setAttribute(_a[0], _a[1]);
		}
		return this;
	}
	/*
	 * html method
	 */
	mm.prototype.html = function(html) {
		if ( html ) {
			this.elm.innerHTML = html;
			return this;
		} else {
			return this.elm.innerHTML;
		}
	}
	/*
	 * text method
	 */
	mm.prototype.text = function(text) {
		this.elm.appendChild(
			document.createTextNode(text)
		);
		return this;
	}
	/*
	 * val metod
	 */
	mm.prototype.val = function(value) {
		if ( !value ) return this.elm.value;
		this.elm.value = value;
		return this;
	}
	/*
	 * append method
	 */
	mm.prototype.append = function() {
		var _a = arguments, i, appendElm;
		if ( _a.length > 1 ) {
			for ( i = 0; i < _a.length; i++ ) {
				if ( _a[i].identifier === "mm" ) {
					appendElm = _a[i].elm;
				} else {
					appendElm = _a[i];
				}
				this.elm.appendChild(appendElm);
			}
		} else {
			if ( _a[0].identifier === "mm" ) {
				appendElm = _a[0].elm;
			} else {
				appendElm = _a[0];
			}
			this.elm.appendChild(appendElm);
		}
		return this;
	}
	/*
	 * bind method
	 * this addEventListener using namespaces
	 */
	mm.prototype.bind = function() {
		var i, _a = arguments, _this = this;
		// 一括登録
		if ( typeof _a[0] === "object" ) {
			for ( i in _a[0] ) {
				bindFunc(i, _a[0][i]);
			}
		// 単体登録
		} else {
			bindFunc(_a[0], _a[1]);
		}
		function bindFunc(type, func) {
			var i, _elm = _this.elm,
				_func = function() { return func.apply(_this, arguments) };
			type = type.split(" ");
			for ( i = 0, l = type.length; i < l; i++ ) {
				// 名前空間の指定がある場合
				if ( type[i].indexOf(".") !== -1 ) {
					type[i] = type[i].split(".");
					_elm["bindedNamed"] = _elm["bindedNamed"] || {};
					_elm["bindedNamed"][type[i][0]] = _elm["bindedNamed"][type[i][0]] || {};
					_elm["bindedNamed"][type[i][0]][type[i][1]] = _func;
					_elm.addEventListener(type[i][0], _func, false);
				// 名前空間の指定がない場合
				} else {
					_elm["binded"] = _elm["binded"] || {};
					_elm["binded"][type] = _elm["binded"][type] || [];
					_elm["binded"][type][_elm["binded"][type].length] = _func;
					_elm.addEventListener(type[i], _func, false);
				}
			}
		}
		return this;
	}
	/*
	 * unbind method
	 * this removeEventListener using namespaces
	 */
	mm.prototype.unbind = function(type) {
		var i = 0, c, d,
			elm = this.elm,
			bindedTypes, bindedEvents, bindedNamedEvents;
		// typeがない場合は全削除
		if ( !type ) {
			// 名前空間無しのイベントを削除
			if ( elm["binded"] ) {
				bindedTypes = elm["binded"];
				for ( c in bindedTypes ) {
					bindedEvents = bindedTypes[c];
					while ( bindedEvents[i] ) {
						elm.removeEventListener(c, bindedEvents[i], false);
						bindedEvents.splice(i, i + 1);
					}
				}
			}
			// 名前空間有りのイベントを削除
			if ( !elm["bindedNamed"] ) return false;
			bindedNamedEvents = elm["bindedNamed"];
			for ( c in bindedNamedEvents ) {
				for ( d in bindedNamedEvents[c] ) {
					elm.removeEventListener(c, bindedNamedEvents[c][d], false);
				}
				delete bindedNamedEvents[c];
			}
		} else
		// namespaceの指定がある場合は単体削除
		if ( type.indexOf(".") !== -1 ) {
			type = type.split(".");
			elm.removeEventListener(type[0], elm["bindedNamed"][type[0]][type[1]], false);
		// typeはあるけど名前空間の指定がない場合はtypeだけ削除
		} else {
			// 名前空間無しのイベントを削除
			if ( elm["binded"] && elm["binded"][type] ) {
				bindedEvents = elm["binded"][type];
				while ( bindedEvents[i] ) {
					elm.removeEventListener(type, bindedEvents[i], false);
					bindedEvents.splice(i, i + 1);
				}
			}
			// 名前空間有りのイベントを削除
			if ( !elm["bindedNamed"] || !elm["bindedNamed"][type] ) return false;
			bindedNamedEvents = elm["bindedNamed"][type];
			for ( c in bindedNamedEvents ) {
				elm.removeEventListener(type, bindedNamedEvents[c], false);
			}
			delete bindedNamedEvents;
		}
		return this;
	}
}(window, document));