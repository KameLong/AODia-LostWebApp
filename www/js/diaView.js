var DiaView = function (e, line, num) {
	this.line = line;
	this.element = e;
	this.diaNum = num;
	this.magnificationH = 2.5;
	this.magnificationW = 5;
	this.init();
	this.initTouch();
	this.gridDraw();
	this.trainDraw();
	this.timeDraw();
	this.stationDraw();
	this.stationTimeArray;//駅間所要時間の配列

	this.pinchCenterX;
	this.pinchCenterY;
	this.pinchSizeX;
	this.pinchSizeY;
	this.originSizeX;
	this.originSizeY;

}
DiaView.prototype.init = function () {
	var self = this;
	function getElementById(id) {
		return self.element.getElementById(id);
	}
	console.log("test");
	//まず、始発駅からの所要時間(stationTimeArray)を整備する
	this.stationTimeArray = new Array();
	this.stationTimeArray[0] = 0;

	for (var i = 1; i < this.line.station.length; i++) {
		this.stationTimeArray[i] = this.stationTimeArray[i - 1] + this.line.getMinTime(i - 1, i) + 30;
	}
	//reset
	getElementById("diagramCanvas").innerHTML = "";
	getElementById("stationCanvas").innerHTML = "";
	getElementById("timeCanvas").innerHTML = "";
	getElementById("diagram").addEventListener("scroll", function () {
		getElementById("time").scrollLeft = getElementById("diagram").scrollLeft;
		getElementById("station").scrollTop = getElementById("diagram").scrollTop;
	}, false);

	getElementById("diagramCanvas").setAttribute("height", this.stationTimeArray[this.line.station.length - 1] / this.magnificationH + 5);
	getElementById("diagramCanvas").setAttribute("width", 86400 / this.magnificationW);
	getElementById("stationCanvas").setAttribute("height", this.stationTimeArray[this.line.station.length - 1] / this.magnificationH + 24);
	getElementById("timeCanvas").setAttribute("width", 86400 / this.magnificationW);

}
DiaView.prototype.initTouch = function () {
	var self = this;
	var element = this.element.getElementById("diagramCanvas");
	element.addEventListener("touchstart", function (e) {
		if (e.touches.length == 2) {
			console.log("pinch");
			var rect = element.getBoundingClientRect();
			console.log(rect.left);
			var positionX = rect.left;	// 要素のX座標
			var positionY = rect.top;	// 要素のY座標
			self.pinchCenterX = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - positionX) * self.magnificationW;//*self.magnificationW;
			self.pinchCenterY = ((e.touches[0].clientY + e.touches[1].clientY) / 2 - positionY) * self.magnificationH;//*self.magnificationH;
			console.log(self.pinchCenterX + "," + self.pinchCenterY);
			self.originSizeX = self.magnificationW;
			self.originSizeY = self.magnificationH;
			self.pinchSizeX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			self.pinchSizeY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
		}
	});
	element.addEventListener("touchmove", function (e) {
		if (e.touches.length == 2) {
			console.log("pinch");
			self.pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;//*self.magnificationW;
			self.pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;//*self.magnificationH;
			console.log(self.pinchCenterX + "," + self.pinchCenterY);
			self.magnificationW = self.originSizeX * self.pinchSizeX / Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			self.magnificationH = self.originSizeY * self.pinchSizeY / Math.abs(e.touches[0].clientY - e.touches[1].clientY);
			self.init();
			self.gridDraw();
			self.trainDraw();
			self.timeDraw();
			self.stationDraw();
		}
	});
	element.addEventListener("touchend", function (e) { });
}
DiaView.prototype.timeDraw = function () {
	var canvas = this.element.getElementById("timeCanvas");
	for (var i = 3; i < 24; i++) {
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute("x", (i - 3) * 3600 / this.magnificationW);
		text.setAttribute("y", 16);

		text.setAttribute("font-size", 20);
		//		text.setAttribute("font-family", "Verdana");
		text.innerHTML = i;
		canvas.appendChild(text);
	}

}
DiaView.prototype.stationDraw = function () {


	var canvas = this.element.getElementById("stationCanvas");
	for (var i = 0; i < this.line.station.length; i++) {
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute("y", this.stationTimeArray[i] / this.magnificationH + 17);
		text.setAttribute("font-size", 15);
		text.innerHTML = this.line.station[i].name;
		canvas.appendChild(text);

	}

}
DiaView.prototype.gridDraw = function () {
	var stationCanvas = this.element.getElementById("stationCanvas");
	var diagramCanvas = this.element.getElementById("diagramCanvas");
	var sideLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	console.log(this.element.getElementById("station").style);
	var stationWidth = (this.element.getElementById("station").currentStyle || document.defaultView.getComputedStyle(this.element.getElementById("station"))).width;
	sideLine1.setAttribute("x1", parseInt(stationWidth) - 1);
	sideLine1.setAttribute("x2", parseInt(stationWidth) - 1);
	sideLine1.setAttribute("y1", 0);
	sideLine1.setAttribute("y2", stationCanvas.getAttribute("height"));
	sideLine1.setAttribute("stroke-width", 2);
	sideLine1.setAttribute("stroke", "#ccc");
	stationCanvas.appendChild(sideLine1);
	var sideLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	sideLine2.setAttribute("x1", 1);
	sideLine2.setAttribute("x2", 1);
	sideLine2.setAttribute("y1", 0);
	sideLine2.setAttribute("y2", stationCanvas.getAttribute("height"));
	sideLine2.setAttribute("stroke-width", 2);
	sideLine2.setAttribute("stroke", "#ccc");
	stationCanvas.appendChild(sideLine2);

	for (var i = 0; i < this.line.station.length; i++) {
		var Line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		Line.setAttribute("x1", 0);
		Line.setAttribute("x2", 100);
		Line.setAttribute("y1", this.stationTimeArray[i] / this.magnificationH + 20);
		Line.setAttribute("y2", this.stationTimeArray[i] / this.magnificationH + 20);
		Line.setAttribute("stroke", "#ccc");
		if (this.line.station[i].scale == 0) {
			Line.setAttribute("stroke-width", 1);
		} else {
			Line.setAttribute("stroke-width", 2);
		}
		stationCanvas.appendChild(Line);

		var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line2.setAttribute("x1", 0);
		line2.setAttribute("x2", 86400 / this.magnificationW);
		line2.setAttribute("y1", this.stationTimeArray[i] / this.magnificationH + 1);
		line2.setAttribute("y2", this.stationTimeArray[i] / this.magnificationH + 1);
		line2.setAttribute("stroke", "#ccc");
		if (this.line.station[i].scale == 0) {
			line2.setAttribute("stroke-width", 1);
		} else {
			line2.setAttribute("stroke-width", 2);
		}
		diagramCanvas.appendChild(line2);


	}
	//10分ごとの破線
	for (var i = 0; i < 24 * 6; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute("x1", i * 600 / this.magnificationW);
		line.setAttribute("x2", i * 600 / this.magnificationW);
		line.setAttribute("y1", 0);
		line.setAttribute("y2", diagramCanvas.getAttribute("height"));
		line.setAttribute("stroke", "#ccc");
		line.setAttribute("stroke-width", 1);
		line.setAttribute("stroke-dasharray", "2,2");
		diagramCanvas.appendChild(line);
	}
	for (var i = 0; i < 24 * 2; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute("x1", i * 1800 / this.magnificationW);
		line.setAttribute("x2", i * 1800 / this.magnificationW);
		line.setAttribute("y1", 0);
		line.setAttribute("y2", diagramCanvas.getAttribute("height"));
		line.setAttribute("stroke", "#ccc");
		if (i % 2 == 0) {
			line.setAttribute("stroke-width", 2);
		}
		else {
			line.setAttribute("stroke-width", 1);
		}
		diagramCanvas.appendChild(line);
	}

	//１時間ごとの太線

}
DiaView.prototype.trainDraw = function () {
	var canvas = this.element.getElementById("diagramCanvas");
	console.log(this.line);
	for (var i = 0; i < this.line.train[this.diaNum][0].length; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		this.drawDownTrain(line, this.line.train[this.diaNum][0][i]);

		canvas.appendChild(line);
	}

	for (var i = 0; i < this.line.train[this.diaNum][1].length; i++) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		this.drawUpTrain(line, this.line.train[this.diaNum][1][i]);

		canvas.appendChild(line);
	}
}

DiaView.prototype.drawDownTrain = function (line, train) {
	var points = "";
	for (var i = 0; i < this.line.station.length; i++) {
		if (train.arriveTime[i] > 0) {
			points = points + " " + ((train.arriveTime[i] - 10800) / this.magnificationW) + "," + (this.stationTimeArray[i] / this.magnificationH + 1);
		}
		if (train.departTime[i] > 0) {
			points = points + " " + ((train.departTime[i] - 10800) / this.magnificationW) + "," + (this.stationTimeArray[i] / this.magnificationH + 1);
		}
	}
	line.setAttribute("points", points);
	line.setAttribute("stroke", this.line.trainType[train.type].diagramColor);
	line.setAttribute("stroke-width", 1);
	line.setAttribute("fill", "none");
}
DiaView.prototype.drawUpTrain = function (line, train) {
	var points = "";
	for (var i = 0; i < this.line.station.length; i++) {
		if (train.departTime[i] > 0) {
			points = points + " " + ((train.departTime[i] - 10800) / this.magnificationW) + "," + (this.stationTimeArray[i] / this.magnificationH + 1);
		}
		if (train.arriveTime[i] > 0) {
			points = points + " " + ((train.arriveTime[i] - 10800) / this.magnificationW) + "," + (this.stationTimeArray[i] / this.magnificationH + 1);
		}

	}
	line.setAttribute("points", points);
	line.setAttribute("stroke", this.line.trainType[train.type].diagramColor);
	line.setAttribute("stroke-width", 1);
	line.setAttribute("fill", "none");
}