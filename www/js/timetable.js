var TimeTable = function (e, line, diaNum, direct) {
	this.line = line;
	this.element = e;
	this.diaNum = parseInt(diaNum);
	this.direct = parseInt(direct);
	this.nowElement;
	this.init();
	this.inputKeyboard();
}
TimeTable.prototype.inputKeyboard = function () {
	var self = this;
	var inputKey = new Array();
	this.element.addEventListener("keydown", function (e) {
		e.preventDefault();
		inputKey[e.keyCode] = true;
	});
	this.element.addEventListener("keyup", function (e) {
		inputKey[e.keyCode] = false;
	});
	setInterval(function () {
		if (inputKey[38]) {
			console.log("up");
			var element = self.element.getElementsByClassName("train" + self.nowElement.dataset.trainNum)[0].getElementsByTagName("div");
			for (var i = 0; i < element.length; i++) {
				if (element[i] == self.nowElement) {
					if (i != 0) {
						element[i].style.border = "";
						element[i - 1].style.border = "dashed 1px #000000";
						self.nowElement = element[i - 1];
					}
					break;
				}


			}
		}
		if (inputKey[40]) {
			var element = self.element.getElementsByClassName("train" + self.nowElement.dataset.trainNum)[0].getElementsByTagName("div");
			for (var i = 0; i < element.length; i++) {
				if (element[i] == self.nowElement) {
					if (i != (element.length - 1)) {
						console.log("down");
						element[i].style.border = "";
						element[i + 1].style.border = "dashed 1px #000000";
						self.nowElement = element[i + 1];
					}
					break;
				}

			}
		}
		if (inputKey[39]) {
			var element = self.element.getElementsByClassName("train" + self.nowElement.dataset.trainNum)[0].getElementsByTagName("div");
			for (var i = 0; i < element.length; i++) {
				if (element[i] == self.nowElement) {
					console.log("right");
					element[i].style.border = "";
					element = self.element.getElementsByClassName("train" + (parseInt(self.nowElement.dataset.trainNum) + 1))[0].getElementsByTagName("div");

					element[i].style.border = "dashed 1px #000000";
					self.nowElement = element[i];
					self.getElementById("trainNameDiv").scrollLeft += 40;
					self.getElementById("trainTimeDiv").scrollLeft += 40;
					break;
				}

			}
		}
		if (inputKey[37]) {
			var element = self.element.getElementsByClassName("train" + self.nowElement.dataset.trainNum)[0].getElementsByTagName("div");
			for (var i = 0; i < element.length; i++) {
				if (element[i] == self.nowElement) {
					console.log("left");
					element[i].style.border = "";
					element = self.element.getElementsByClassName("train" + (parseInt(self.nowElement.dataset.trainNum) - 1))[0].getElementsByTagName("div");

					element[i].style.border = "dashed 1px #000000";
					self.nowElement = element[i];
					self.getElementById("trainNameDiv").scrollLeft -= 40;
					self.getElementById("trainTimeDiv").scrollLeft -= 40;
					break;
				}

			}
		}
		if (inputKey[13]) {

			var event = document.createEvent("MouseEvents");
			event.initMouseEvent("dblclick", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			self.nowElement.dispatchEvent(event);

		}
	}, 1000 / 20);
}
/*上り下りでデータの駅順と時刻表の駅順が異なることに対する処置 */
TimeTable.prototype.station = function (station) {
	if (this.direct == 0) {
		return station;
	} else {
		return this.line.station.length - station - 1;
	}
}
TimeTable.prototype.getElementById = function (id) {
	return this.element.getElementById(id);
}
TimeTable.prototype.getElementByIdDetail = function (id) {
	return this.getElementById("trainTimeDetail").contentWindow.document.getElementById(id);
}
/*駅名の更新 */
TimeTable.prototype.refreshStation = function () {
	var stationTable = this.getElementById("stationName");
	stationTable.innerHTML = "";
	for (var i = 0; i < this.line.station.length; i++) {
		var row = stationTable.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = this.line.station[this.station(i)].name;
		if (this.line.station[this.station(i)].displayArriveTime(this.direct) &&
			this.line.station[this.station(i)].displayDepartTime(this.direct)) {
			cell.classList.add("main");
		}
	}
}
/*列車の更新*/
/**
 * 列車の更新について

aodiaで列車をどのように配置するか
１、並び替え可能
２、遅延読み込み
３、lineの列車順とdivの対応

１，３を考えるといっそのこと並び替えがあるたびにlineのtrain配列をいじるほうがいい気がしてきた。
splice()を多用すればいけるんじゃないかな？
 */
TimeTable.prototype.refreshTrain = function (trainDiv, i) {
	var self = this;
	trainDiv.innerHTML = "";
	trainDiv.classList.add("colunm");
	trainDiv.addEventListener("dblclick",function(){self.trainTimeDclick();},false);
	trainDiv.dataset.trainNum=i;
	trainDiv.style.color = this.line.trainType[this.line.train[this.diaNum][this.direct][i].type].textColor;
	for (var j = 0; j < this.line.station.length; j++) {
		var stationDiv=this.element.createElement('div');
		stationDiv.dataset.stationNum=j;
		trainDiv.appendChild(stationDiv);
		this.refreshTime(stationDiv);
	}

}
TimeTable.prototype.trainTimeClick=function(element){
	try{this.nowElement.style.border="";}
	catch(e){}
	element.style.border="dashed 1px #000";
	this.nowElement=element;
}
TimeTable.prototype.trainTimeDclick=function(element){
	this.showDialog();
}
/*列車時刻の更新 */
TimeTable.prototype.refreshTime=function(stationDiv){
	var self=this;
	stationDiv.innerHTML="";
	//stationDivとその親要素のデータから列車番号と駅番号を求める
	var trainNum=parseInt(stationDiv.parentNode.dataset.trainNum);
	var stationNum=parseInt(stationDiv.dataset.stationNum);
	if(this.line.station[this.station(stationNum)].displayArriveTime(this.direct)&&this.line.station[this.station(stationNum)].displayDepartTime(this.direct)){
		var arriveDiv=this.element.createElement('Div');
		arriveDiv.innerHTML= this.line.train[this.diaNum][this.direct][trainNum].getArriveTimeS(this.station(stationNum));
		arriveDiv.classList.add("arrive");
		arriveDiv.dataset.ad="true";
		arriveDiv.addEventListener("click",function(){self.trainTimeClick(this);},false);

		stationDiv.appendChild(arriveDiv);
		var departDiv=this.element.createElement('Div');
		departDiv.innerHTML= this.line.train[this.diaNum][this.direct][trainNum].getDepartTimeS(this.station(stationNum));
		departDiv.classList.add("depart");
		departDiv.dataset.ad="true";
		departDiv.addEventListener("click",function(){self.trainTimeClick(this);},false);
		stationDiv.appendChild(departDiv);
		return;
	}
	if(this.line.station[stationNum].displayDepartTime(this.direct)){
		stationDiv.innerHTML= this.line.train[this.diaNum][this.direct][trainNum].getDepartTimeS(this.station(stationNum));
		stationDiv.classList.add("depart");
		stationDiv.addEventListener("click",function(){self.trainTimeClick(this);},false);

	}
	if(this.line.station[stationNum].displayArriveTime(this.direct)){
		stationDiv.innerHTML= this.line.train[this.diaNum][this.direct][trainNum].getArriveTimeS(this.station(stationNum));
		stationDiv.classList.add("depart");
		stationDiv.addEventListener("click",function(){self.trainTimeClick(this);},false);

	}

}
/*初期設定*/
TimeTable.prototype.init = function () {
	var self = this;
	//スクロール連動
	this.getElementById("trainTimeDiv").addEventListener("scroll", function () {
		self.getElementById("trainNameDiv").scrollLeft = self.getElementById("trainTimeDiv").scrollLeft;
		self.getElementById("stationNameDiv").scrollTop = self.getElementById("trainTimeDiv").scrollTop;
	}, false);
	this.refreshStation();
	//タッチ処理
	var trainTime = this.getElementById("trainTime");
	var touch = new TouchEvent(trainTime);
	console.log("log");
	trainTime.addEventListener("leftTap", function () {
		self.nowElement.dispatchEvent("click");
	}, false);
	trainTime.addEventListener("rightTap", function () {
		console.log("rightTap");
		//self.nowElement.dispatchEvent("oncontextmenu");エラー
	}, false);
	trainTime.addEventListener("leftDown", function () {
		console.log("leftDown");
		var train = self.nowElement.dataset.trainNum;
		var station = self.nowElement.dataset.stationNum;
		console.log(train + "," + station);
		self.line.train[self.diaNum][self.direct][parseInt(train)].departTime[parseInt(station)] += 60;
		self.refreshTrain(self.getElementById("trainTime").getElementsByClassName("train" + train)[0], train);

	});
	trainTime.addEventListener("leftUp", function () {
		console.log("leftUp");
		var train = self.nowElement.dataset.trainNum;
		var station = self.nowElement.dataset.stationNum;
		console.log(train + "," + station);
		self.line.train[self.diaNum][self.direct][parseInt(train)].departTime[parseInt(station)] -= 60;
		self.refreshTrain(self.getElementById("trainTime").getElementsByClassName("train" + train)[0], train);

	});

	for (var i = 0; i < this.line.train[this.diaNum][this.direct].length; i++) {
		//まずtrainを格納するdivを作る
		var div = this.element.createElement('div');
		this.refreshTrain(div, i);
		trainTime.appendChild(div);
	}

	var trainName = this.getElementById("trainName");
	for (var i = 0; i < this.line.train[this.diaNum][this.direct].length; i++) {
		var div = this.element.createElement('div');
		div.classList.add("colunm");
		var table = this.element.createElement('table');
		var trainNumberCell = table.insertRow(-1).insertCell(-1);
		trainNumberCell.innerHTML = this.line.train[this.diaNum][this.direct][i].number;
		var trainTypeCell = table.insertRow(-1).insertCell(-1);
		trainTypeCell.innerHTML = this.line.trainType[this.line.train[this.diaNum][this.direct][i].type].abbName;
		trainTypeCell.style.color = this.line.trainType[this.line.train[this.diaNum][this.direct][i].type].textColor;
		var trainNameCell = table.insertRow(-1).insertCell(-1);
		trainNameCell.innerHTML = this.line.train[this.diaNum][this.direct][i].name;
		trainNameCell.classList.add("trainName");
		div.appendChild(table);
		trainName.appendChild(div);
	}

	this.getElementById("trainTimeDetail").onload = function () {
		var getElementByIdDetail = function (id) {
			return self.getElementById("trainTimeDetail").contentWindow.document.getElementById(id);
		}
		getElementByIdDetail("close").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		getElementByIdDetail("canselButton").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		getElementByIdDetail("trainTimeDetailForm").addEventListener("submit", function () {
			self.changeTrain(parseInt(self.nowTrain));
		}, false);

		//タイトルをつかむことにより移動することを可能にする
		self.getElementByIdDetail("title").addEventListener('dragstart', function (e) {
			self.startMouthX = e.screenX;
			self.startMouthY = e.screenY;
			self.startTop = self.getElementById("trainTimeDetail").getBoundingClientRect().top;
			self.startLeft = self.getElementById("trainTimeDetail").getBoundingClientRect().left;
			//windows倍率
			e.dataTransfer.setDragImage(self.getElementById("trainTimeDetail"), e.clientX, e.clientY);
			e.stopPropagation();
		}, false);
		self.getElementByIdDetail("title").addEventListener('dragend', function (e) {
			self.getElementById("trainTimeDetail").style.top = self.startTop + e.screenY - self.startMouthY;
			self.getElementById("trainTimeDetail").style.left = self.startLeft + e.screenX - self.startMouthX;
		}, false);
		self.element.addEventListener('dragover', function (e) {
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}
			e.dataTransfer.dropEffect = 'move';
		}, false);
		self.element.getElementById("trainTimeDetail").contentDocument.addEventListener('dragover', function (e) {
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}
			e.dataTransfer.dropEffect = 'move';
		}, false);
	}
	this.getElementById("trainTimeDetail").onload();

}
/*ダイアログ表示*/
TimeTable.prototype.showDialog = function () {
	var self = this;
	if(this.nowElement.dataset.ad=="true"){
	var trainNum=this.nowElement.parentNode.parentNode.dataset.trainNum;
	var stationNum=this.nowElement.parentNode.dataset.stationNum;
	}else{
	var trainNum=this.nowElement.parentNode.dataset.trainNum;
	var stationNum=this.nowElement.dataset.stationNum;
	}

	this.getElementByIdDetail("arriveTime").value = this.line.train[this.diaNum][this.direct][trainNum].getArriveTimeS(stationNum);
	this.getElementByIdDetail("departTime").value = this.line.train[this.diaNum][this.direct][trainNum].getDepartTimeS(stationNum);
	this.getElementByIdDetail("trainTimeDetailForm").type[parseInt(this.line.train[this.diaNum][this.direct][trainNum].stopType[stationNum])].checked = "checked";
	this.getElementById("trainTimeDetail").style.display = "block";
}
TimeTable.prototype.closeDialog = function () {
	this.getElementById("trainTimeDetail").style.display = "none";
}
TimeTable.prototype.changeTrain = function (train, station) {
	var self = this;
	if(this.nowElement.dataset.ad=="true"){
	var trainNum=this.nowElement.parentNode.parentNode.dataset.trainNum;
	var stationNum=this.nowElement.parentNode.dataset.stationNum;
	}else{
	var trainNum=this.nowElement.parentNode.dataset.trainNum;
	var stationNum=this.nowElement.dataset.stationNum;
	}
		this.line.train[this.diaNum][this.direct][trainNum].setArriveTime(this.getElementByIdDetail("arriveTime").value, stationNum);
	this.line.train[this.diaNum][this.direct][trainNum].setDepartureTime(this.getElementByIdDetail("departTime").value, stationNum);
	this.line.train[this.diaNum][this.direct][trainNum].stopType[stationNum] = this.getElementByIdDetail("trainTimeDetailForm").type.value;
	this.closeDialog();
	if(this.nowElement.dataset.ad=="true"){
	this.refreshTime(this.nowElement.parentNode);
	}else{
	this.refreshTime(this.nowElement);
	}

}
