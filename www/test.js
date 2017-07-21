/*二本の指でタッチジェスチャーを行うときにイベント判断しを発火させるクラス */
var TouchEvent = function (element) {
	this.element = element;//ジェスチャー対象のdom要素
	//タッチ開始ポイント
	this.touchStartX = new Array();
	this.touchStartY = new Array();
	//スライドの値
	this.slide = 0;
	//二本目の指が１本目の左側にあるかどうか
	this.leftFrag = false;
	//各種判定
	this.slideFrag = false;
	this.scrollFrag = false;
	this.pinchFrag = false;
	//ピンチインアウトの初期距離
	this.pinchDis = 0
	//ピンチインアウトの指の角度;
	this.pinchRad = 0;
	//押してる時間　長押しなどの判定に
	this.pressTime = new Array();
	this.init();
}
window.onload = function () {
	var result = document.getElementById("result");
	result.innerHTML = "start";
}
TouchEvent.prototype.touchMove=function(e){
	e.preventDefault();
	if (e.touches.length == 2) {
		
		var slidePos1 = Math.round((e.touches[1].pageY - this.touchStartY[1]) / 25);
		if (this.scrollFrag) {
			var scroll = (e.touches[0].pageY - this.touchStartY[0] + e.touches[1].pageY -this. touchStartY[1]) / 2;
			//document.getElementById("result").innerHTML = "scroll" + scroll + "<br>" + document.getElementById("result").innerHTML;
			console.log("scroll");
			var event = new Event('doubleScroll');
			event.scrollY=scroll;
			this.element.dispatchEvent(event);
			return;
		}
		if (this.pinchFrag) {
			var dis = Math.sqrt((e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY), (e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX));
			//document.getElementById("result").innerHTML = "pinch " + (Math.floor(dis / pinchDis * 100)) + "%<br>" + document.getElementById("result").innerHTML;
			return;
		}
		if (this.slideFrag || (!this.scrollFrag && !this.pinchFrag)) {
			if (this.slide < slidePos1) {
				this.slideFrag = true;
				this.slide++;
				if (this.leftFrag) {
					//document.getElementById("result").innerHTML = "LeftDown<br>" + document.getElementById("result").innerHTML;
				} else {
					//document.getElementById("result").innerHTML = "RightDown<br>" + document.getElementById("result").innerHTML;
				}
			}
			if (this.slide > slidePos1 + 1) {
				this.slideFrag = true;
				this.slide--;
				if (this.leftFrag) {
					//document.getElementById("result").innerHTML = "LeftUp<br>" + document.getElementById("result").innerHTML;
				} else {
					//document.getElementById("result").innerHTML = "RightUp<br>" + document.getElementById("result").innerHTML;
				}
			}
			if (this.slideFrag) {
				return;
			}
		}
		if (Math.abs(e.touches[0].pageY - this.touchStartY[0]) > 25) {
			this.scrollFrag = true;
		}
		console.log(Math.abs(Math.atan2(e.touches[1].pageY - e.touches[0].pageY, e.touches[1].pageX - e.touches[0].pageX) - this.pinchRad));
		if (Math.abs(Math.atan2(e.touches[1].pageY - e.touches[0].pageY, e.touches[1].pageX - e.touches[0].pageX) -this. pinchRad) < 0.1 && Math.abs(Math.sqrt((e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY), (e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX)) - this.pinchDis) > 30) {
			this.pinchFrag = true;

		}

	}
}
TouchEvent.prototype.touchStart=function(e){
	var number = e.changedTouches[0].identifier;
	if (number == 1) {
		this.slide = 0;
		this.touchStartX[0] = e.touches[0].pageX;
		this.touchStartY[0] = e.touches[0].pageY;
		this.scrollFrag = false;
		this.slideFrag = false;
		this.pinchFrag = false;
		if (e.touches[1].pageX - e.touches[0].pageX > 0) {
			this.leftFrag = false;
		} else {
			this.leftFrag = true;
		}
		this.pinchRad = Math.atan2(e.touches[1].pageY - e.touches[0].pageY, e.touches[1].pageX - e.touches[0].pageX);
		this.pinchDis = Math.sqrt((e.touches[1].pageY - e.touches[0].pageY) * (e.touches[1].pageY - e.touches[0].pageY), (e.touches[1].pageX - e.touches[0].pageX) * (e.touches[1].pageX - e.touches[0].pageX));
	}
	this.touchStartX[number] = e.changedTouches[0].pageX;
	this.touchStartY[number] = e.changedTouches[0].pageY;
	this.pressTime[number] = new Date().getTime();
}
TouchEvent.prototype.touchEnd=function(e){
	var number = e.changedTouches[0].identifier;
	if (number == 1) {
		var nowTime = new Date().getTime();
		if (nowTime - this.pressTime[1] < 100) {
			if (this.leftFrag) {
			//	document.getElementById("result").innerHTML = "leftTap<br>" + document.getElementById("result").innerHTML;
			console.log("leftTap");
			} else {
			//	document.getElementById("result").innerHTML = "rightTap<br>" + document.getElementById("result").innerHTML;
			}
		}
	}
}
TouchEvent.prototype.init=function(){
	var self=this;
this.element.addEventListener("touchstart",function(e){self.touchStart(e)});
this.element.addEventListener("touchmove",function(e){self.touchMove(e)});
this.element.addEventListener("touchend",function(e){self.touchEnd(e)});
//		document.addEventListener("touchcancel",TouchEventFunc);
}
