var TimeTable = function (e, line, diaNum, direct) {
	this.line = line;
	this.element = e;
	this.diaNum = parseInt(diaNum);
	this.direct = parseInt(direct);
	this.nowTrain;
	this.nowStation;
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
					if(i!=0){
						element[i].style.border = "";
						element[i-1].style.border = "dashed 1px #000000";
						self.nowElement=element[i-1];
					}
					break;
				}
				
	
			}
		}
		if (inputKey[40]) {
			var element = self.element.getElementsByClassName("train" + self.nowElement.dataset.trainNum)[0].getElementsByTagName("div");
			for (var i = 0; i < element.length; i++) {
				if (element[i] == self.nowElement) {
					if(i!=(element.length-1)){
						console.log("down");
						element[i].style.border = "";
						element[i+1].style.border = "dashed 1px #000000";
						self.nowElement=element[i+1];
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
						element=self.element.getElementsByClassName("train" + (parseInt(self.nowElement.dataset.trainNum)+1))[0].getElementsByTagName("div");
						
						element[i].style.border = "dashed 1px #000000";
						self.nowElement=element[i];
						self.getElementById("trainNameDiv").scrollLeft+=40;
						self.getElementById("trainTimeDiv").scrollLeft+=40;
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
						element=self.element.getElementsByClassName("train" + (parseInt(self.nowElement.dataset.trainNum)-1))[0].getElementsByTagName("div");
						
						element[i].style.border = "dashed 1px #000000";
						self.nowElement=element[i];
						self.getElementById("trainNameDiv").scrollLeft-=40;
						self.getElementById("trainTimeDiv").scrollLeft-=40;
					break;
				}
	
			}
		}
		if (inputKey[13]) {
			
			var event = document.createEvent("MouseEvents");  
event.initMouseEvent("dblclick", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
			self.nowElement.dispatchEvent(event);
			
		}
	}, 1000 /20);
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
	stationTable.innerHTML="";
	for (var i = 0; i < this.line.station.length; i++) {
		var row = stationTable.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = this.line.station[this.station(i)].name;
		if(this.line.station[this.station(i)].displayArriveTime()&&this.line.station[this.station(i)].displayDepartTime()){
		if (Math.floor(this.line.station[this.station(i)].format / (4 - 3 * this.direct)) % 4 == 3) {
			cell.classList.add("main");
		}
	}

}
/* */
TimeTable.prototype.refreshTrain = function (trainDiv, i) {
	var self = this;
	trainDiv.className = "";
	trainDiv.innerHTML = "";
	trainDiv.classList.add("colunm");
	trainDiv.classList.add('train' + i);
	trainDiv.style.color = this.line.trainType[this.line.train[this.diaNum][this.direct][i].type].textColor;
	for (var j = 0; j < this.line.station.length; j++) {
		/*direct=0で8 direct=1で2になるもの
		8-6*direct
		*/
		if (Math.floor(parseInt(this.line.station[this.station(j)].format) / (8 - 6 * this.direct)) % 2 == 1) {
			var stationDiv = this.element.createElement('div');
			stationDiv.dataset.trainNum = i;
			stationDiv.dataset.stationNum = this.station(j);
			stationDiv.addEventListener("dblclick", function (e) {
				e.preventDefault();
				self.nowTrain = this.dataset.trainNum;
				self.nowStation = this.dataset.stationNum;
				self.showDialog();
			}, false);
			stationDiv.addEventListener("click", function () {
				try {
					self.nowElement.style.border = "";
				} catch (e) { }
				this.style.border = "dashed 1px #000000";
				self.nowElement = this;
			}, false);
			stationDiv.classList.add("arrive");
			stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][i].getArriveTimeS(this.station(j));
			trainDiv.appendChild(stationDiv);
		}
		if (Math.floor(parseInt(this.line.station[this.station(j)].format) / (4 - 3 * this.direct)) % 2 == 1) {
			var stationDiv = this.element.createElement('div');
			stationDiv.dataset.trainNum = i;
			stationDiv.dataset.stationNum = this.station(j);
			stationDiv.addEventListener("dblclick", function (e) {
				e.preventDefault();
				self.nowTrain = this.dataset.trainNum;
				self.nowStation = this.dataset.stationNum;
				self.showDialog();
			}, false);
			stationDiv.addEventListener("click", function () {
				try {
					self.nowElement.style.border = "";
				} catch (e) { }

				this.style.border = "dashed 1px #000000";
				self.nowElement = this;
			}, false);

			stationDiv.classList.add("depart");
			stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][i].getDepartTimeS(this.station(j));
			trainDiv.appendChild(stationDiv);
		}
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
	var touch=new TouchEvent(trainTime);
	console.log("log");
	trainTime.addEventListener("leftTap",function(){
		self.nowElement.dispatchEvent("click");
	},false);
	trainTime.addEventListener("rightTap",function(){
		console.log("rightTap");
		//self.nowElement.dispatchEvent("oncontextmenu");エラー
	},false);
	trainTime.addEventListener("leftDown",function(){
		console.log("leftDown");
		var train=self.nowElement.dataset.trainNum;
		var station=self.nowElement.dataset.stationNum;
		console.log(train+","+station);
		self.line.train[self.diaNum][self.direct][parseInt(train)].departTime[parseInt(station)]+=60;
		self.refreshTrain(self.getElementById("trainTime").getElementsByClassName("train" + train)[0], train);

	});
	trainTime.addEventListener("leftUp",function(){
		console.log("leftUp");
		var train=self.nowElement.dataset.trainNum;
		var station=self.nowElement.dataset.stationNum;
		console.log(train+","+station);
		self.line.train[self.diaNum][self.direct][parseInt(train)].departTime[parseInt(station)]-=60;
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

	this.getElementByIdDetail("arriveTime").value = this.line.train[this.diaNum][this.direct][this.nowTrain].getArriveTimeS(this.nowStation);
	this.getElementByIdDetail("departTime").value = this.line.train[this.diaNum][this.direct][this.nowTrain].getDepartTimeS(this.nowStation);
	this.getElementByIdDetail("trainTimeDetailForm").type[parseInt(this.line.train[this.diaNum][this.direct][this.nowTrain].stopType[this.nowStation])].checked = "checked";
	this.getElementById("trainTimeDetail").style.display = "block";
}
TimeTable.prototype.closeDialog = function () {
	this.getElementById("trainTimeDetail").style.display = "none";
}
TimeTable.prototype.changeTrain = function (train, station) {
	var self = this;

	this.line.train[this.diaNum][this.direct][this.nowTrain].setArriveTime(this.getElementByIdDetail("arriveTime").value, this.nowStation);
	this.line.train[this.diaNum][this.direct][this.nowTrain].setDepartureTime(this.getElementByIdDetail("departTime").value, this.nowStation);
	this.line.train[this.diaNum][this.direct][this.nowTrain].stopType[this.nowStation] = this.getElementByIdDetail("trainTimeDetailForm").type.value;
	this.closeDialog();
	this.refreshTrain(this.getElementById("trainTime").getElementsByClassName("train" + train)[0], this.nowTrain);
}
/*
TimeTable.prototype.refreshTrain = function (train) {
	var self = this;
	console.log(this.getElementById("trainTime").getElementsByClassName("train" + train), train);
	var trainDiv = this.getElementById("trainTime").getElementsByClassName("train" + train)[0];
	trainDiv.innerHTML = "";
	trainDiv.style.color = this.line.trainType[this.line.train[this.diaNum][this.direct][train].type].textColor;
	for (var j = 0; j < this.line.station.length; j++) {
		if (((this.direct == 0) && (Math.floor(this.line.station[j].format / 8) % 2 == 1)) || ((this.direct == 1) && (Math.floor(this.line.station[this.line.station.length - j - 1].format / 2) % 2 == 1))) {
			var stationDiv = this.element.createElement('div');
			stationDiv.dataset.trainNum = train;
			stationDiv.dataset.stationNum = this.station(j);
			stationDiv.addEventListener("click", function () {
				console.log(this.dataset.trainNum, this.dataset.stationNum);
			}, false);
			stationDiv.classList.add("arrive");
			if (this.direct == 0) {
				stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][train].getArriveTimeS(j);
			} else {
				stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][train].getArriveTimeS(this.line.station.length - j - 1);
			}

			trainDiv.appendChild(stationDiv);

		}
		var stationDiv = this.element.createElement('div');
		stationDiv.dataset.trainNum = train;
		stationDiv.dataset.stationNum = this.station(j);
		stationDiv.addEventListener("click", function () {
			console.log(this.dataset.trainNum, this.dataset.stationNum);
			self.nowTrain = this.dataset.trainNum;
			self.nowStation = this.dataset.stationNum;
			self.showDialog();
		}, false);

		stationDiv.classList.add("depart");
		if (this.direct == 0) {
			stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][train].getDepartTimeS(j);
		} else {
			stationDiv.innerHTML = this.line.train[this.diaNum][this.direct][train].getDepartTimeS(this.line.station.length - j - 1);
		}
		trainDiv.appendChild(stationDiv);
	}
}
*/