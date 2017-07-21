
var Aodia = function () {
	this.line = null;

}
function log(log, level) {
	switch (level) {
		case 0:
			console.log("debug" + log);
			break;
		case 1:
			console.log("error" + log);
			break;
		default:
			console.log("other"+log);
	}
}
Aodia.prototype.init = function () {
	var self = this;
	/*developer*/
	var xhr = new XMLHttpRequest();
    xhr.open('GET',"test.aod", true);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
		self.line = new Line();
		self.line.loadJson(this.response);
		self.menuInit();
		self.reset();
    };
	xhr.send();	
	
	//sideMenu init
	this.menuInit();
	//menu button
	var newButton = document.getElementById("newButton");
	newButton.addEventListener("click", function () {
		self.newButonClick();
	}, false);

	var openButton = document.getElementById("openButton");
	openButton.addEventListener("click", function () {
		document.getElementById("fileOpen").click();
	}, false);
	//aod形式の読み込み
	var fileOpen = document.getElementById("fileOpen");
	fileOpen.addEventListener("change", function (evt) {
		var file = evt.target.files;
		var reader = new FileReader();
		//テキスト形式で読み込む
		//読込終了後の処理
		reader.onload = function (ev) {
			self.line = new Line();
			self.line.loadJson(reader.result);
			self.menuInit();
			self.reset();
		}
		reader.readAsText(file[0]);
	});
	/*oudファイルの読み込み*/
	var openOudButton = document.getElementById("openOudButton");
	openOudButton.addEventListener("click", function () {
		document.getElementById("fileOudOpen").click();
	}, false);
	var fileOudOpen = document.getElementById("fileOudOpen");
	fileOudOpen.addEventListener("change", function (evt) {
		var file = evt.target.files;
		var reader = new FileReader();
		//テキスト形式で読み込む
		reader.readAsText(file[0], "Shift-JIS");
		//読込終了後の処理
		reader.onload = function (ev) {
			self.line = new Line();
			self.line.loadOud(reader.result);
			self.menuInit();
			self.reset();
		}
	});
	//保存ボタン
	var saveButton = document.getElementById("saveButton");
	saveButton.addEventListener("click", function () {
		self.line.saveFile();
	});
	//メニュー開閉ボタン（android版のみ)
	var menuButton=document.getElementById("menuButton");
	menuButton.addEventListener("click",function(){
		console.log("menu");
		if(document.getElementById("sideMenu").style.display=="none"){
			document.getElementById("sideMenu").style.display="block";
		}else{
			document.getElementById("sideMenu").style.display="none";
		}
	});
}
/*メイン画面リセット 
メイン画面のリセットは
・新規作成
・ファイルを開く
・すべてのウインドウを閉じる（未実装）
で行われます
*/
Aodia.prototype.reset=function(){
	document.getElementById("main").innerHTML="";
}
/*新規作成処理*/
Aodia.prototype.newButonClick = function () {
	this.line = new Line();
	this.menuInit();
	this.reset();
}
/*サイドメニューの作成 */
Aodia.prototype.menuInit = function () {
	var self = this;
	if(this.line==null){
		log("ファイルが読み込まれていません",0);
		return;
	}
	try {
		var string = "<ul><li><a id='stationButton' >駅</a></li><li><a id='trainTypeButton' >列車種別</a></li><li><span id='diaList'>ダイヤ一覧</span></li><ul>";
		for (var i = 0; i < this.line.train.length; i++) {
			string = string + "<li><span style='    overflow: hidden;white-space: nowrap;    text-overflow: ellipsis;  ' class='dia'>";
			string = string + this.line.diaName[i];
			string = string + "</span></li><ul><li><span class='down'>下り時刻表</span></li><li><span class='up'>上り時刻表</span></li><li><span class='diagram'>ダイヤグラム</span></li></ul>";
		}
		/*
		string = string + "</ul><li>コメント</li></ul>";
		*/
		document.getElementById("sideMenu").innerHTML = string;
		/*クリック処理を実装*/
		document.getElementById("stationButton").addEventListener('click',
			function () {
				document.getElementById("main").innerHTML = "<iframe id='stationFrame' name='stationFrame' src='station.html'></iframe>";
				document.getElementById("stationFrame").onload = function () {
					var stationView = new StationView(document.getElementById("stationFrame").contentWindow.document, self.line);
				}
			}, false);
		document.getElementById("trainTypeButton").addEventListener('click', function () {
			document.getElementById("main").innerHTML = "<iframe id='trainTypeFrame' name='trainTypeFrame' src='trainType.html'></iframe>";
			document.getElementById("trainTypeFrame").onload = function () {
				var trainTypeView = new TrainTypeView(document.getElementById("trainTypeFrame").contentWindow.document, self.line);
			}
		}, false);
		for (var i = 0; i < document.getElementsByClassName("diagram").length; i++) {
			document.getElementsByClassName("diagram")[i].dataset.num = i;
			document.getElementsByClassName("diagram")[i].addEventListener("click", function () {
				var num = this.dataset.num;
				document.getElementById("main").innerHTML = "<iframe id='diagramFrame' name='diagramFrame' src='diaView.html'></iframe>";
				document.getElementById("diagramFrame").onload = function () {
					var diaView = new DiaView(document.getElementById("diagramFrame").contentWindow.document, self.line, num);
				}
			});
		}
		for (var i = 0; i < document.getElementsByClassName("down").length; i++) {
			document.getElementsByClassName("down")[i].dataset.num = i;
			console.log(document.getElementsByClassName("down")[i].dataset.num);
			document.getElementsByClassName("down")[i].addEventListener("click", function () {
				var num = this.dataset.num;
				document.getElementById("main").innerHTML = "<iframe id='timeTableFrame'  name='timeTableFrame' src='timetable.html'></iframe>";
				document.getElementById("timeTableFrame").onload = function () {
					var timeTable = new TimeTable(document.getElementById("timeTableFrame").contentWindow.document, self.line, num, 0);
				}
			});
		}
		document.getElementsByClassName("down")[0].click();
		for (var i = 0; i < document.getElementsByClassName("up").length; i++) {
			document.getElementsByClassName("up")[i].dataset.num = i;
			document.getElementsByClassName("up")[i].addEventListener("click", function () {
				var num = this.dataset.num;
				document.getElementById("main").innerHTML = "<iframe id='timeTableFrame' name='timeTableFrame' src='timetable.html'></iframe>";
				document.getElementById("timeTableFrame").onload = function () {
					var timeTable = new TimeTable(document.getElementById("timeTableFrame").contentWindow.document, self.line, num, 1);
				}
			});
		}
	} catch (e) {
		log(e,1);
		document.getElementById("sideMenu").innerHTML = "";
	}
}
window.onload = function () {
	var aodia = new Aodia;
	aodia.init();
}