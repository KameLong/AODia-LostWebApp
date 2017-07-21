var StationView = function (e, line) {
	this.element = e;
	this.line = line;//路線データ
	this.stationNum = 1;
	this.nowStation = 0;
	this.ondown = false;
	this.init();
}
StationView.prototype.getElementById = function (id) {
	return this.element.getElementById(id);
}
StationView.prototype.getElementByIdDetail = function (id) {
	return this.element.getElementById("stationDetail").contentWindow.document.getElementById(id);
}
StationView.prototype.init = function () {
	var self = this;
	var table = this.getElementById("stationTable");

	//this.lineのstationデータを反映
	for (var i = 0; i < this.line.station.length; i++) {
		var row = table.insertRow(i + 1);
		row.dataset.stationNumber = i;
		row.addEventListener("click", function () {
			self.nowStation = this.dataset.stationNumber;
			self.showDialog();
		}, false);
		row.insertCell(-1);
		row.insertCell(-1);
		row.insertCell(-1);
		this.refreshStation(i);
	}
	//追加用スペース
	var newTr = table.getElementsByTagName("tr")[this.line.station.length + 1];
	newTr.dataset.stationNumber = this.line.station.length;
	newTr.addEventListener("click", function () {
		self.nowStation = this.dataset.stationNumber;
		self.showDialog();
	}, false);

	/*stationDetail.htmlが読み込まれたときの動作 */
	this.element.getElementById("stationDetail").onload = function () {
		//stationDetail.htmlの要素にクリック処理を追加
		//右上閉じるボタン
		self.getElementByIdDetail("close").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		//キャンセルボタン
		self.getElementByIdDetail("canselButton").addEventListener("click", function () {
			self.closeDialog();
		}, false);
		//フォームのsubmit設定
		self.getElementByIdDetail("stationDetailForm").addEventListener("submit",
			function () {
				self.changeStation(parseInt(self.nowStation));
			}
			, false);
	}
	//stationDetail.htmlの初回の読み込みでは処理が行われないので、ここで処理しておく
	this.getElementById("stationDetail").onload();
}
/*ダイアログ出現時の処理 */
StationView.prototype.showDialog = function () {
	var self = this;
	//タイトルをつかむことにより移動することを可能にする
	this.getElementByIdDetail("title").addEventListener('dragstart', function (e) {
		self.startMouthX = e.screenX;
		self.startMouthY = e.screenY;
		self.startTop = self.getElementById("stationDetail").getBoundingClientRect().top;
		self.startLeft = self.getElementById("stationDetail").getBoundingClientRect().left;
		console.log(e.clientX);
		//1.5はwindows倍率
		e.dataTransfer.setDragImage(self.getElementById("stationDetail"), e.clientX * 1.5, e.clientY * 1.5);
		e.stopPropagation();

	}, false);
	this.getElementByIdDetail("title").addEventListener('dragend', function (e) {
		self.getElementById("stationDetail").style.top = self.startTop + e.screenY - self.startMouthY;
		self.getElementById("stationDetail").style.left = self.startLeft + e.screenX - self.startMouthX;
	}, false);
	this.element.addEventListener('dragover', function (e) {
		if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		}
		e.dataTransfer.dropEffect = 'move';
	}, false);
	this.element.getElementById("stationDetail").contentDocument.addEventListener('dragover', function (e) {
		if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		}
		e.dataTransfer.dropEffect = 'move';
	}, false);

	//ダイアログを表示
	this.getElementById("stationDetail").style.display = "block";
	//駅名入力欄にフォーカスを充てておく
	this.getElementById("stationDetail").contentWindow.document.stationDetail.stationName.focus();
	if (this.line.station.length <= this.nowStation) {
		return;
	}
	this.getElementByIdDetail("stationName").value = this.line.station[this.nowStation].name;
	//駅時刻扱いの初期設定
	var kindArray = this.getElementByIdDetail("stationDetailForm").kind;
	switch (this.line.station[this.nowStation].format) {
		case 15:
			kindArray[1].checked = "cheaked";
			break;
		case 6:
			kindArray[2].checked = "cheaked";
			break;
		case 9:
			kindArray[3].checked = "cheaked";
			break;
		default:
			kindArray[0].checked = "cheaked";
	}
	//駅規模の初期設定
	if (this.line.station[this.nowStation].scale == 1) {
		this.getElementByIdDetail("stationDetailForm").size[1].checked = "checked";
	} else {
		this.getElementByIdDetail("stationDetailForm").size[0].checked = "checked";
	}
}
/*ダイアログを閉じるときの設定*/
StationView.prototype.closeDialog = function () {
	this.getElementById("stationDetail").style.display = "none";
}
/*submitされたときの処理*/
StationView.prototype.changeStation = function (pos) {
	var self = this;
	if (this.line.station.length <= pos) {
		//最後の駅のデータを入力した場合もう一つ駅を追加
		this.line.station[pos] = new Station();
		var newRow = this.element.getElementById("stationTable").insertRow(-1);
		newRow.addEventListener("click", function () {
			self.showDialog();
			self.nowStation = this.dataset.num;
		}, false);
		newRow.dataset.num = pos + 1;
		newRow.insertCell(-1);
		newRow.insertCell(-1);
		newRow.insertCell(-1);
	}
	//それぞれの項目をlineに反映させる
	this.line.station[pos].name = this.getElementByIdDetail("stationName").value;
	this.line.station[pos].format = parseInt(this.getElementByIdDetail("stationDetailForm").kind.value);
	this.line.station[pos].scale = parseInt(this.getElementByIdDetail("stationDetailForm").size.value);
	//this.getElementByIdDetail("stationName").value = "";
	this.closeDialog();
	//駅情報を更新
	this.refreshStation(pos);
}
/*駅情報の更新 */
StationView.prototype.refreshStation = function (pos) {
	var trElement = this.element.getElementsByTagName("tr")[pos + 1];
	var tdElements = trElement.getElementsByTagName("td");
	tdElements[0].innerHTML = this.line.station[pos].name;
	tdElements[1].innerHTML = this.line.station[pos].getFormatS();
	tdElements[2].innerHTML = this.line.station[pos].getSizeS();
}