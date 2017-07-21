var Line = function () {
	this.fileName = "";
	this.lineName = "test";
	this.station = new Array();
	this.trainType = new Array();
	this.train = new Array();
	this.diaName = new Array();
	this.init();
}
var Station = function (object) {
	if (typeof object == "undefined") {
		this.name = "";
		this.format = 5;
		this.scale = 0;
	} else {
		this.name = object.name;
		this.format = object.format;
		this.scale = object.scale;
	}
}
var TrainType = function (object) {
	if (typeof object == "undefined") {
		this.name = "";
		this.abbName = "";
		this.textColor = "#000";
		this.diagramColor = "#000";
	} else {
		try {
			this.name = object.name;
			this.abbName = object.abbName;
			this.textColor = object.textColor;
			this.diagramColor = object.diagramColor;
		}
		catch (e) {
			console.log(e);
			this.name = "";
			this.abbName = "";
			this.textColor = "#000";
			this.diagramColor = "#000";
		}
	}
}
var Train = function (stationNum, object) {
	if (typeof object == "undefined") {
		this.name = "";
		this.number = "";
		this.type = 0;
		this.stopType = new Array();//駅数分の配列
		this.arriveTime = new Array();
		this.departTime = new Array();
		this.stationNum = stationNum;
	} else {
		this.name = object.name;
		this.number = object.number;
		this.type = object.type;
		this.stopType = object.stopType;
		this.arriveTime = object.arriveTime;
		this.departTime = object.departTime;
		this.stationNum = stationNum;
	}
}
//Line method
//初期設定
Line.prototype.init = function () {
}
//駅間最小所要時間を求める
Line.prototype.getMinTime=function(startStation,endStation){
	var result=90000;
	for(var i=0;i<this.train.length;i++){
		for(var j=0;j<2;j++){
			for(var k=0;k<this.train[i][j].length;k++){
				if(this.train[i][j][k].stopType[startStation]==1&&this.train[i][j][k].stopType[endStation]==1){
					var time=Math.abs(this.train[i][j][k].time(endStation)-this.train[i][j][k].time(startStation));
					if(result>time){
						result=time;
					}
				}
			}
		}
	}
	return result;
}
//駅を挿入する。
//既存の駅があれば移動させる。
Line.prototype.addStation = function (pos) {
	//まず駅を作る。
	for (var i = this.station.length; i > pos; i--) {
		this.station[i] = this.station[i - 1];
	}
	this.station[pos] = new Station();
	//列車の駅を更新する
	for (var i = 0; i < this.train.length; i++) {
		for (j = 0; j < 2; j++) {
			for (k = 0; k < this.train[i][j].length; k++) {
			}
		}
	}
}
//駅を削除する
Line.prototype.removeStation = function (pos) {
	//todo
}
//Fileに保存する
Line.prototype.saveFile = function () {
	var str = JSON.stringify(this);
	var blob = new Blob([str], { "type": "application/x-msdownload" });
	var download = document.getElementById("download");
	download.href = window.URL.createObjectURL(blob);
	download.download = this.lineName + ".aod";
	console.log("download");
	download.click();
}
Line.prototype.saveOudFile = function () {
	var fileData = "FileType=OuDia.1.02\r\n";
	fileData += "Rosen.\r\n";
	fileData += "Rosenmei=" + this.lineName + "\r\n";
	for (var i = 0; i < this.station.length; i++) {
		if (this.station[i]) {
			fileData += "Eki.\r\n";
			fileData += "Ekimei=" + this.station[i].name + "\r\n";
			fileData += "Ekijikokukeisiki=Jikokukeisiki_";
			switch (this.station[i].format) {
				case 15:
					fileData += "Hatsuchaku";
					break;
				case 6:
					fileData += "NoboriChaku";
					break;
				case 9:
					fileData += "KudariChaku";
					break;
				default:
					fileData += "Hatsu";
			}
			fileData += "\r\nEkikibo=Ekikibo_";
			if (this.station.scale == 1) {
				fileData += "Syuyou";
			} else {
				fileData += "Ippan";
			}
			fileData += "\r\n.\r\n";
		}
	}


	for (var i = 0; i < this.trainType.length; i++) {
			fileData += "Ressyasyubetsu.\r\n";
		if (this.trainType[i]) {
			fileData += "Syubetsumei=" + this.trainType[i].name;
			if (this.trainType[i].abbName) {
				fileData += "\r\nRyakusyou=" + this.trainType[i].abbName;
			}
			fileData += "\r\nJikokuhyouMojiColor=00" + this.trainType[i].textColor.substring(1);
			fileData += "\r\nJikokuhyouFontIndex=0";
			fileData += "\r\nDiagramSenColor=00" + this.trainType[i].diagramColor.substring(1);
			fileData += "\r\nDiagramSenStyle=SenStyle_Jissen";
			fileData += "\r\nDiagramSenIsBold=0";
			fileData += "\r\nStopMarkDrawType=EStopMarkDrawType_Nothing";
			fileData += "\r\n.\r\n";
		}
	}
	for (var i = 0; i < this.train.length; i++) {
		fileData += "Dia.\r\n";
		fileData += "DiaName=" + this.diaName[i];
		fileData += "\r\nKudari.\r\n";
		for (var j = 0; j < this.train[i][0].length; j++) {
			fileData += "Ressya.\r\nHoukou=Kudari\r\n";
			fileData += "Syubetsu=" + this.train[i][0][j].type;
			fileData += "\r\nRessyabangou=" + this.train[i][0][j].number;
			if (this.train[i][0][j].name) {
				fileData += "\r\nRessyamei=" + this.train[i][0][j].name;
			}
			fileData += "\r\nEkiJikoku=";
			for (k = 0; k < this.station.length; k++) {
				if (k != 0) {
					fileData += ",";
				}
				switch (this.train[i][0][j].stopType[k]) {
					case 1:
						fileData += "1;";
						if (this.train[i][0][j].arriveTime[k] > 0) {
							fileData += this.train[i][0][j].getArriveTimeS(k) + "/";
						}
						if (this.train[i][0][j].departTime[k] > 0) {
							fileData += this.train[i][0][j].getDepartTimeS(k);
						}
						break;
					case 2:
						fileData += "2";
						break;
					case 3:
						fileData += "3";
						break;
				}
			}
			fileData += "\r\n.\r\n";
		}
		fileData += ".\r\nNobori.\r\n";
		for (var j = 0; j < this.train[i][1].length; j++) {
			fileData += "Ressya.\r\nHoukou=Nobori\r\n";
			fileData += "Syubetsu=" + this.train[i][1][j].type;
			fileData += "\r\nRessyabangou=" + this.train[i][1][j].number;
			if (this.train[i][1][j].name) {
				fileData += "\r\nRessyamei=" + this.train[i][1][j].name;
			}
			fileData += "\r\nEkiJikoku=";
			for (k = this.station.length - 1; k >= 0; k--) {
				if (k != this.station.length - 1) {
					fileData += ",";
				}
				switch (this.train[i][1][j].stopType[k]) {

					case 1:
						fileData += "1;";
						if (this.train[i][1][j].arriveTime[k] > 0) {
							fileData += this.train[i][1][j].getArriveTimeS(k) + "/";
						}
						if (this.train[i][1][j].departTime[k] > 0) {
							fileData += this.train[i][1][j].getDepartTimeS(k);
						}
						break;
					case 2:
						fileData += "2";
						break;
					case 3:
						fileData += "3";
						break;
				}
			}
			fileData += "\r\n.\r\n";
		}
		fileData += ".\r\n";
	}
	fileData += ".\r\n";
	fileData += "KitenJikoku=300\r\n";
	fileData += "DiagramDgrYZahyouKyoriDefault=60\r\n";
	fileData += "FileTypeAppComment=OuDia Ver. 1.00.01\r\n";
	var blob = new Blob([fileData], { "type": "application/x-msdownload" });
	var download = document.getElementById("download");
	download.href = window.URL.createObjectURL(blob);
	download.download = this.lineName + ".aod";
	console.log("download");
	download.click();
}
/*JSONの文字列からデータを復元 */
Line.prototype.loadJson = function (json) {
	var tmp = JSON.parse(json);
	this.lineName = tmp.lineName;
	this.diaName = tmp.diaName;
	for (var i = 0; i < tmp.station.length; i++) {
		this.station[i] = new Station(tmp.station[i]);
	}
	for (var i = 0; i < tmp.trainType.length; i++) {
		this.trainType[i] = new TrainType(tmp.trainType[i]);
	}
	for (var i = 0; i < tmp.train.length; i++) {
		this.train[i] = new Array();
		for (var j = 0; j < tmp.train[i].length; j++) {
			this.train[i][j] = new Array();
			for (var k = 0; k < tmp.train[i][j].length; k++) {
				this.train[i][j][k] = new Train(this.station.length, tmp.train[i][j][k]);
			}
		}
	}
}
/*oudファイルから読み込みをさせる */
Line.prototype.loadOud = function (oud) {
	var data = oud.split('\r\n');
	console.log(data[0]);
	this.lineName = data[2].split('=')[1];
	var stationNum = 0;
	var trainTypeNum = 0;
	var diaNum = -1;
	var trainNum = 0;
	var direct = 0;
	/*このループはファイルの最終行まで読み込む*/
	for (var i = 3; i < data.length; i++) {
		if (data[i] == "Eki.") {
			this.station[stationNum] = new Station();
			while (data[i] != ".") {
				i++;
				if (data[i].split('=')[0] == "Ekimei") {
					this.station[stationNum].name = data[i].split('=')[1];
				}
				if (data[i].split('=')[0] == "Ekijikokukeisiki") {
					var Jikokukeisiki = data[i].split('_')[1];
					if (Jikokukeisiki == "Hatsuchaku") {
						this.station[stationNum].format = 15;
					} else if (Jikokukeisiki == "NoboriChaku") {
						this.station[stationNum].format = 6;
					} else if (Jikokukeisiki == "KudariChaku") {
						this.station[stationNum].treat = 9;
					}
				}
				if (data[i].split('=')[0] == "Ekikibo") {

					var Ekikibo = data[i].split('_')[1];
					console.log(Ekikibo);
					if (Ekikibo == "Ippan") {
						this.station[stationNum].scale = 0;
					} else if (Ekikibo == "Syuyou") {
						this.station[stationNum].scale = 1;
					}
				}
			}

			stationNum++;

		}
		if (data[i] == "Ressyasyubetsu.") {

			this.trainType[trainTypeNum] = new TrainType();
			while (data[i] != ".") {
				i++;
				if (data[i].split('=')[0] == "Syubetsumei") {
					this.trainType[trainTypeNum].name = data[i].split('=')[1];
				}
				if (data[i].split('=')[0] == "Ryakusyou") {
					this.trainType[trainTypeNum].abbName = data[i].split('=')[1];
				}
				if (data[i].split('=')[0] == "JikokuhyouMojiColor") {
					this.trainType[trainTypeNum].setTextColor8(data[i].split('=')[1]);
				}
				if (data[i].split('=')[0] == "DiagramSenColor") {
					this.trainType[trainTypeNum].setDiagramColor8(data[i].split('=')[1]);
				}

			}
			trainTypeNum++;
		}
		if (data[i] == "Dia.") {
			i++;
			diaNum++;
			this.diaName[diaNum] = data[i].split('=')[1];
			this.train[diaNum] = Array();
		}
		if (data[i] == "Kudari.") {
			direct = 0;
			this.train[diaNum][direct] = Array();
			trainCount = 0;
		}
		if (data[i] == "Nobori.") {
			direct = 1;
			this.train[diaNum][direct] = Array();
			trainCount = 0;
		}
		if (data[i] == "Ressya.") {

			this.train[diaNum][direct][trainCount] = new Train(this.station.length);
			while (data[i] != ".") {
				i++;
				if (data[i].split('=')[0] == "Syubetsu") {
					this.train[diaNum][direct][trainCount].type = parseInt(data[i].split('=')[1]);
				}
				if (data[i].split('=')[0] == "Ressyabangou") {
					this.train[diaNum][direct][trainCount].number = parseInt(data[i].split('=')[1]);
				}
				if (data[i].split('=')[0] == "EkiJikoku") {
					this.train[diaNum][direct][trainCount].setTime(data[i].split('=')[1].split(','), direct);
				}
			}

			trainCount++;
		}
	}
	console.log(this);
}
Station.prototype.displayArriveTime=function(direct){
	 return (Math.floor(this.format/(8-6*direct))%2==1);
}
Station.prototype.displayDepartTime=function(direct){
	 return (Math.floor(this.format/(4-3*direct))%2==1);
}
TrainType.prototype.setTextColor8 = function (str) {
	var blue = str.substring(2, 4);
	var green = str.substring(4, 6);
	var red = str.substring(6, 8);
	this.textColor = "#" + red + green + blue;
}
TrainType.prototype.setDiagramColor8 = function (str) {
	var blue = str.substring(2, 4);
	var green = str.substring(4, 6);
	var red = str.substring(6, 8);
	this.diagramColor = "#" + red + green + blue;

}
Train.prototype.setTime = function (data, direct) {
	for (var i = 0; i < data.length; i++) {
		var station;
		if (direct == 0) {
			station = i;
		} else {
			station = this.stationNum - 1 - i;
		}
		if (data[i].length == 0) {
			this.setType(0, station);
			continue;
		}
		this.setType(data[i].split(';')[0], station);
		if (data[i].length == 1) {
			continue;
		}
		if (data[i].indexOf("/") == -1) {
			this.setDepartureTime(data[i].substring(2), station);
		} else {
			this.setArriveTime(data[i].substring(2, data[i].indexOf("/")), station);
			this.setDepartureTime(data[i].substring(data[i].indexOf("/") + 1), station);
		}
	}
}
Train.prototype.setType = function (type, station) {
	if (type < 0 || type > 3) {
		type = 0;
	}
	this.stopType[station] = parseInt(type);
}
Train.prototype.setDepartureTime = function (str, station) {
	var h = 0;
	var m = 0;
	switch (str.indexOf(':')) {
		case 1:
			if (str.length == 4) {
				h = Integer.parseInt(str.substring(0, 1));
				m = Integer.parseInt(str.substring(2, 4));
			} else {
				return -1;
			}
			break;
		case 2:
			if (str.length == 5) {
				h = Integer.parseInt(str.substring(0, 2));
				m = Integer.parseInt(str.substring(3, 5));
			} else { return -1; }
			break;
		case -1:
			if (str.length == 3) {
				h = parseInt(str.substring(0, 1));
				m = parseInt(str.substring(1, 3));
			} else if (str.length == 4) {
				h = parseInt(str.substring(0, 2));
				m = parseInt(str.substring(2, 4));
			} else {
				return -1;
			}
			break;
	}
	while (h < 3 || h > 26) {
		if (h < 3) {
			h = h + 24;
		}
		if (h > 26) {
			h = h - 24;
		}
	}
	this.departTime[station] = 3600 * h + 60 * m;
}
Train.prototype.setArriveTime = function (str, station) {
	var h = 0;
	var m = 0;
	switch (str.indexOf(':')) {
		case 1:
			if (str.length == 4) {
				h = Integer.parseInt(str.substring(0, 1));
				m = Integer.parseInt(str.substring(2, 4));
			} else { return -1; }
			break;
		case 2:
			if (str.length == 5) {
				h = Integer.parseInt(str.substring(0, 2));
				m = Integer.parseInt(str.substring(3, 5));
			} else { return -1; }
			break;
		case -1:
			if (str.length == 3) {
				h = parseInt(str.substring(0, 1));
				m = parseInt(str.substring(1, 3));
			} else if (str.length == 4) {
				h = parseInt(str.substring(0, 2));
				m = parseInt(str.substring(2, 4));
			} else { return -1; }
			break;
	}
	while (h < 3 || h > 26) {
		if (h < 3) {
			h = h + 24;
		}
		if (h > 26) {
			h = h - 24;
		}
	}
	this.arriveTime[station] = 3600 * h + 60 * m;
}
Train.prototype.getDepartTimeS = function (station) {
	if (this.stopType[station] == 1) {
		if (this.departTime[station] > 0) {
			var s = this.departTime[station] % 60;
			var m = ((this.departTime[station] - s) / 60) % 60;
			var h = (((this.departTime[station] - s) / 60 - m) / 60) % 60;
			m = "" + m;
			if (m.length == 1) {
				m = "0" + m;
			}
			return "" + h + m;
		} else {
			if (this.arriveTime[station] > 0) {
				return this.getArriveTimeS(station);
			}
		}
	}
	if (this.stopType[station] == 2) {
		return "レ";
	}
	if (this.stopType[station] == 3) {
		return "｜｜";
	}

	return "：：";
}

Train.prototype.getArriveTimeS = function (station) {
	if (this.stopType[station] == 1) {
		if (this.arriveTime[station] > 0) {
			var s = this.arriveTime[station] % 60;
			var m = ((this.arriveTime[station] - s) / 60) % 60;
			var h = (((this.arriveTime[station] - s) / 60 - m) / 60) % 60;
			m = "" + m;
			if (m.length == 1) {
				m = "0" + m;
			}
			return "" + h + m;
		} else {
			if (this.departTime[station] > 0) {
				return this.getDepartTimeS(station);
			}
		}
	}

	if (this.stopType[station] == 2) {
		return "レ";
	}
	if (this.stopType[station] == 3) {
		return "｜｜";
	}

	return "：：";
}
//発時刻を返す、発時刻がなければ着時刻を返す、両方ともなければnullを返す
Train.prototype.time=function(station){
	if(this.departTime[station]>0){
		return this.departTime[station];
	}
	if(this.arriveTime[station]>0){
		return this.arriveTime[station];
	}
	return null;
}
Station.prototype.getFormatS = function () {
	switch (this.format) {
		case 5:
			return "発時刻";
		case 15:
			return "発着";
		case 9:
			return "下り着時刻";
		case 6:
			return "上り着時刻";
		default:
			return this.format;
	}
}
Station.prototype.getSizeS = function () {
	switch (this.scale) {
		case 0:
			return "一般駅";
		case 1:
			return "主要駅";
		default:
			return "";
	}
}