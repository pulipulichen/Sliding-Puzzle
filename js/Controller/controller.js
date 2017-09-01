/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
    s.controller = function () {
	s.c.sliderSize = slider.tileSize;
	
	s.c.isMovelLegal = function(x, y){
		var retValue = {"isLegal" : false};
                
                
            if (slider.enable === false) {
                return retValue;
            }
		if(s.m.emptyRef["x"]===x && s.m.emptyRef["y"]!==y){
			retValue = {"isLegal" : true , "direction" : "y" , "displacement" : s.m.emptyRef["y"]-y};
		}else if(s.m.emptyRef["y"]===y && s.m.emptyRef["x"]!==x){
			retValue = {"isLegal" : true , "direction" : "x" , "displacement" : s.m.emptyRef["x"]-x};
		}
                //console.log(retValue);
		return retValue;
	};
        
        s.c.shuffle = function(a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
            return a;
        };
        
        s.c.getEmptyTileBoxId = function () {
            var _pos = _getPosFromTileId(slider.tileSize*slider.tileSize-1);
            var _boxId = _parsePosToBoxId(_pos);
            return _boxId;
        };
        
        s.c.movableDirection = function () {
            // 先取得空位的所在位置
            var _boxId = s.c.getEmptyTileBoxId();
            //console.log(_boxId);
            
            var _enable_dir_config = {
                u: true,
                d: true,
                l: true,
                r: true
            };
            
            if (_boxId < slider.tileSize) {
                _enable_dir_config.u = false;
            }
            if (_boxId < slider.tileSize) {
                _enable_dir_config.u = false;
            }
            if (_boxId > slider.tileSize*(slider.tileSize-1) - 1) {
                _enable_dir_config.d = false;
            }
            if ((_boxId % slider.tileSize) === 0 ) {
                _enable_dir_config.l = false;
            }
            if ((_boxId % slider.tileSize) === (slider.tileSize - 1) ) {
                _enable_dir_config.r = false;
            }
            
            var _enable_dir = [];
            for (var _j in _enable_dir_config) {
                if (_enable_dir_config[_j] === true) {
                    _enable_dir.push(_j);
                }
            }
            
            return s.c.shuffle(_enable_dir);
        };
        
        s.c.swapDirection = function (_dir) {
            if (typeof(_dir) === "string") {
                _dir = s.c.shuffle(_dir)[0];
            }
            else if (_dir === undefined) {
                _dir = s.c.movableDirection()[0];
            }
            
            var _box_id = s.c.getEmptyTileBoxId();
            if (_dir === "u") {
                _box_id = _box_id - slider.tileSize;
            }
            else if (_dir === "d") {
                _box_id = _box_id + slider.tileSize;
            }
            else if (_dir === "l") {
                _box_id = _box_id - 1;
            }
            else if (_dir === "r") {
                _box_id = _box_id + 1;
            }
            $("#slider .tile:eq(" + _box_id + ")").click();
        };
        
        var _getPosFromTileId = function (_id) {
            var _pos2 = (_id % slider.tileSize);  // 8 % 3
            var _pos1 = ((_id-_pos2) / slider.tileSize); // 8-2 % 3
            //console.log([_pos2, _pos1]);
            return $(".tile" + (_pos1) + "" + (_pos2)).attr("id").replace("box", "");
        };
        
        var _parsePosToBoxId = function (_pos) {
            var _id_list = _pos.split("");
            var _id = 0;
            for (var _j = _id_list.length-1; _j > -1; _j--) {
                var _number = parseInt(_id_list[_j], 10);
                //console.log([_c, _number, _j,  (_id_list.length - _j - 1), Math.pow((s.m.size), (_id_list.length - _j - 1 ))]);
                _id = _id + (_number) * Math.pow((s.m.size), (_id_list.length - _j - 1 ));
            }
            return _id;
        };
	
	s.c.swap = function(source, direction , displacement){
            
		var noOfIterations,previousEmptyRef;
		noOfIterations = (displacement<0) ? displacement * -1  : displacement;
		previousEmptyRef = {"x" : s.m.emptyRef["x"] , "y" : s.m.emptyRef["y"]};
			
		for(var i = 0 , x = tempx = s.m.emptyRef["x"] , y = tempy = s.m.emptyRef["y"] ; i <= noOfIterations ; i++){
			s.m.state[tempx][tempy] = s.m.state[x][y];
			tempx = x;
			tempy = y;
			if(direction==="y"){
				y = (displacement<0) ? y +1  : y -1; 
			}else{
				x = (displacement<0) ? x +1  : x -1;
			}
		}
		// Updating game state in model
		s.m.emptyRef["x"] = source["x"];
		s.m.emptyRef["y"] = source["y"];
		s.m.state[source["x"]][source["y"]] = s.m.emptyTile;
		
		// Swap the tiles in the UI
		s.v.puzzle.swapTiles(previousEmptyRef ,direction , displacement);
	
            if (slider.enableLogStep === true) {
                if (typeof(slider.stepLog) === "undefined") {
                    slider.stepLog = [];
                    
                    // 載入必要檔案
                    $.getScript("https://pulipulichen.github.io/blog-pulipuli-info-data-2017/04/console-webpage-crawler/FileSaver.js", function () {
                        //var file = new File(["1,2,3\n4,5,6"], "hello world.csv", {type: "text/csv;charset=utf-8"});
                        //saveAs(file);
                    });
                }
                var _tile_array = [];
                var _tile_pattern = [];
                $("#slider .tile").each(function (_i, _tile) {
                    var _classname_list = _tile.className.split(" ");
                    var _id;
                    for (var _i = 0; _i < _classname_list.length; _i++) {
                        var _c = _classname_list[_i];
                        if (_c.length > 4 && _c.substr(0, 4) === "tile") {
                            var _pos = _c.substring(4, _c.length);
                            _id = _parsePosToBoxId(_pos);
                        }
                    }
                    _tile_array.push(_id);
                    _tile_pattern.push(_id);
                });
                
                _tile_pattern = _tile_pattern.join("=");
                // 先搜尋之前的步驟中有沒有這個_pattern
                for (var _i = 0; _i < slider.stepLog.length; _i++) {
                    var _a = slider.stepLog[_i];
                    //console.log("檢索");
                    //console.log([(_a.length-1)]);
                    if (_a[(_a.length-1)] === _tile_pattern) {
                        // 把這個位置刪掉
                        slider.stepLog.splice(_i, 1);
                        //console.log("刪除 " + _i);
                    }
                }
                
                
                if (direction === "x") {
                    _tile_array.push(0);
                }
                else {
                    _tile_array.push(1);
                }
                _tile_array.push(displacement);
                _tile_array.push(_tile_pattern);
                slider.stepLog.push(_tile_array);
                //console.log(_tile_array);
                
                //direction
            }
        
            if (s.m.state.join()===s.m.solution.join()) {
            //if (true) {
                clearInterval(slider.timer);
                document.getElementById("gameBoardPlaying").style.display = "none";
                document.getElementById("gameBoardFinish").style.display = "block";
                if (slider.imageURL === undefined) {
                    $(".share").hide();
                }
                
                var _time = document.getElementById("timeElapsed").innerText;
                var _step = document.getElementById("stepElapsed").innerText;
                ga('send', 'event', "finish_puzzle", "time:"+_time + ",step:" + _step + ",size:"+slider.tileSize, "url:" + slider.imageURL);
                slider.enable = false;
                setTimeout(function () {
                    alert("恭喜您完成拼圖了！您的完成時間是："+ _time + "，總共花了" + _step + "步。");
                    //slider.stopTimer = true;
                    
                    if (slider.enableLogStep === true) {
                        var today = new Date();
                        today = today.toISOString().substring(0, 19).replace(/:/g, "-");
                        
                        // 把slider.stepLog轉換為csv
                        // 先刪除多餘動作
                        var _csv = [];
                        for (var _i = 0; _i < slider.stepLog.length; _i++) {
                            var _a = slider.stepLog[_i];
                            _a.splice(_a.length-1, 1);
                            _csv.push(_a.join(","));
                        }
                        console.log("總共" + _csv.length + "步驟");
                        _csv = _csv.join("\n");
                        var file = new File([_csv], "puzzle-" + slider.tileSize + "-" + today + ".csv", {type: "text/csv;charset=utf-8"});
                        saveAs(file);
                    }
                }, 0);
            }
	};
	
    };
})(window,slider);