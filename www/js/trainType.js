var TrainTypeView = function (e, line) {
	this.element = e;
	this.line = line;
	this.nowType = 0;
	this.init();
}
TrainTypeView.prototype.getElementById = function (id) {
	return this.element.getElementById(id);
}
TrainTypeView.prototype.init = function () {
	var self = this;
	var table = this.getElementById("trainTypeTable");
	//this.lineのtrainTypeデータを反映
	for (var i = 0; i < this.line.trainType.length; i++) {
		var row = table.insertRow(i + 1);
		row.dataset.typeNumber = i;
		row.addEventListener("click", function () {
			self.nowType = this.dataset.typeNumber;
			self.showDialog();
		}, false);
		row.insertCell(-1);
		row.insertCell(-1);
		row.insertCell(-1);
		row.insertCell(-1);
		this.refreshTrainType(i);
	}
	//追加用スペース
	var newTr = table.getElementsByTagName("tr")[this.line.trainType.length + 1];
	newTr.dataset.typeNumber = this.line.trainType.length;
	newTr.addEventListener("click", function () {
		self.nowType = this.dataset.typeNumber;
		self.showDialog();
	}, false);
	this.getElementById("trainTypeDetail").onload = function () {
		var getElementById = function (id) {
			return self.getElementById("trainTypeDetail").contentWindow.document.getElementById(id);
		}
		//trainTypeDetail.htmlの要素にクリック属性を追加
		getElementById("close").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		getElementById("canselButton").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		getElementById("trainTypeDetailForm").addEventListener("submit", function () {
			self.changeTrainType(parseInt(self.nowType));
			console.log("submit");
		}, false);

	}
	this.getElementById("trainTypeDetail").onload();
}
TrainTypeView.prototype.showDialog = function () {
	var self = this;
	var getDetailElementById = function (id) {
		return self.getElementById("trainTypeDetail").contentWindow.document.getElementById(id);
	}
	this.getElementById("trainTypeDetail").style.display = "block";
	this.getElementById("trainTypeDetail").contentWindow.document.trainTypeDetail.trainTypeName.focus();
	getDetailElementById("trainTypeName").value = this.line.trainType[this.nowType].name;
	getDetailElementById("trainTypeNameAbb").value = this.line.trainType[this.nowType].abbName;
	getDetailElementById("trainTypeMojiColor").value = this.line.trainType[this.nowType].textColor;
	getDetailElementById("trainTypeDiaColor").value = this.line.trainType[this.nowType].diagramColor;

}
TrainTypeView.prototype.closeDialog = function () {
	this.getElementById("trainTypeDetail").style.display = "none";
}
TrainTypeView.prototype.changeTrainType = function (pos) {
	var self = this;
	var getDetailElementById = function (id) {
		return self.getElementById("trainTypeDetail").contentWindow.document.getElementById(id);
	}
	if (this.line.trainType.length > pos) {
		this.line.trainType[pos].name = getDetailElementById("trainTypeName").value;
	} else {
		var newRow = this.getElementById("trainTypeTable").insertRow(-1);
		nowRow.addEventListener("click", function () {
			self.showDialog();
			self.nowType = this.dataset.num;
		}, false);
		nowRow.dataset.num = pos + 1;
		newRow.insertCell(-1);
		newRow.insertCell(-1);
		newRow.insertCell(-1);
		newRow.insertCell(-1);
		this.line.trainType[pos] = new TrainTime();
		this.line.trainType[pos].name = getDetailElementById("trainTypeName").value;
	}
	this.line.trainType[pos].abbName = getDetailElementById("trainTypeNameAbb").value;
	this.line.trainType[pos].textColor = getDetailElementById("trainTypeMojiColor").value;
	this.line.trainType[pos].diagramColor = getDetailElementById("trainTypeDiaColor").value;
	

	getDetailElementById("trainTypeName").value = "";
	this.closeDialog();
	this.refreshTrainType(pos);
}
TrainTypeView.prototype.refreshTrainType = function (pos) {
	var trElement = this.element.getElementsByTagName("tr")[pos + 1];
	var tdElements = trElement.getElementsByTagName("td");
	tdElements[0].innerHTML = pos;
	tdElements[1].innerHTML = this.line.trainType[pos].name;
	tdElements[2].innerHTML = this.line.trainType[pos].abbName;
	tdElements[2].style.color = this.line.trainType[pos].textColor;
	tdElements[3].style.backgroundColor = this.line.trainType[pos].diagramColor;

}