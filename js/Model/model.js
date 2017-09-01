/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
    s.model = function () {
        //console.log("start model");
        
        s.m.size = slider.tileSize;
        var _slider_width = slider.calcSliderWidth()
        s.m.tileSize = (_slider_width / s.m.size);
        s.m.emptyTile = "tile" + (s.m.size-1) + "" + (s.m.size-1);
	//console.log(s.m.emptyTile);
        
        // 這個要改成隨機產生...
        var shuffle = function(a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        };
        
        var _tiles = [];
        for (var _x = 0; _x < s.m.size; _x++) {
            for (var _y = 0; _y < s.m.size; _y++) {
                _tiles.push("tile" + _x + "" + _y);
            }
        }
        
        /*
        s.m.solution = [["tile00","tile01","tile02","tile03"],
		               ["tile10","tile11","tile12","tile13"],
		               ["tile20","tile21","tile22","tile23"],
		               ["tile30","tile31","tile32","tile33"]];
        0   1   2   3
        4   5   6   7
        8   9   10  11
        12  13  14  15
	*/
        s.m.solution = [];
        var _line = [];
        for (var _i = 0; _i < _tiles.length; _i++) {
            _line.push(_tiles[_i]);
            if (_line.length === s.m.size) {
                s.m.solution.push(_line);
                _line = [];
            }
        }
        
        var _do_shuffle = slider.enableSuffle;
        var _empty_tile_pos = s.m.size * s.m.size - 1;
        if (_do_shuffle) {
            var _switch_tile = function (_pos1, _pos2) {
                var _tmp_tile = _tiles[_pos1];
                _tiles[_pos1] = _tiles[_pos2];
                _tiles[_pos2] = _tmp_tile;
            };
            
            //shuffle(_tiles);
            // 執行交換title 100次的動作
            var _last_direct;
            for (var _i = 0; _i < slider.shuffle_weight * s.m.size * s.m.size; _i++) {
                //var _direct = shuffle(["u", "d", "l", "r"])[0];
                var _enable_dir_config = {
                    u: true,
                    d: true,
                    l: true,
                    r: true
                };
                
                // ---------------
                
                if (_last_direct === "d" || _empty_tile_pos < s.m.size) {
                    _enable_dir_config.u = false;
                }
                if (_last_direct === "u" ||_empty_tile_pos > _tiles.length - s.m.size - 1) {
                    _enable_dir_config.d = false;
                }
                if (_last_direct === "l" || (_empty_tile_pos % s.m.size) === 0 ) {
                    _enable_dir_config.l = false;
                }
                if (_last_direct === "r" || (_empty_tile_pos % s.m.size) === (s.m.size - 1) ) {
                    _enable_dir_config.r = false;
                }
                
                // ---------------
                
                var _enable_dir = [];
                for (var _j in _enable_dir_config) {
                    if (_enable_dir_config[_j] === true) {
                        _enable_dir.push(_j);
                    }
                }
                //console.log(_enable_dir);
                
                // ---------------
                shuffle(_enable_dir);
                var _direct = _enable_dir[0];
                _last_direct = _direct;
                
                var _tmp_tile;
                var _switch_pos;
                if (_direct === "u") {
                    _switch_pos = _empty_tile_pos - s.m.size;
                }
                else if (_direct === "d") {
                    _switch_pos = _empty_tile_pos + s.m.size;
                }
                else if (_direct === "l") {
                    _switch_pos = _empty_tile_pos - 1;
                }
                else if (_direct === "r") {
                    _switch_pos = _empty_tile_pos + 1;
                }
                _switch_tile(_switch_pos, _empty_tile_pos);
                _empty_tile_pos = _switch_pos;
                
                //console.log("ok 交換" + _direct);
            }   // for (var _i = 0; _i < 2; _i++) {
        }
        else {
            _tiles[(_tiles.length-2)] = "tile" + (s.m.size-1) + "" + (s.m.size-1);
            _tiles[(_tiles.length-1)] = "tile" + (s.m.size-1) + "" + (s.m.size-2);
        }
        
        /*
	s.m.state =	[["tile33","tile02","tile21","tile32"],
	               ["tile11","tile13","tile12","tile30"],
	               ["tile31","tile10","tile23","tile03"],
	               ["tile22","tile20","tile01","tile00"]];
        */
       
        s.m.state = [];
        var _line = [];
        for (var _i = 0; _i < _tiles.length; _i++) {
            _line.push(_tiles[_i]);
            
            
            if (_tiles[_i] === "tile" + (s.m.size-1) + "" + (s.m.size-1)) {
                s.m.emptyRef = {"y" : (_i % s.m.size ) , "x" : s.m.state.length};
            }
            
            if (_line.length === s.m.size) {
                s.m.state.push(_line);
                _line = [];
            }
        }
        
        // s.m.emptyRef = {"x" : 1 , "y" : 0};
        //console.log(s.m.emptyRef);
        
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id="tile_style";
        var _tileStyle = [];
        for (var _x = 0; _x < s.m.size; _x++) {
            for (var _y = 0; _y < s.m.size; _y++) {
                var _classname = ".tile.tile" + _y + "" + _x;
                // 設定這個tile的background-position
                var _x_px = (_x * s.m.tileSize * -1) + "px";
                var _y_px = (_y * s.m.tileSize * -1) + "px";
                //var _classname = ".tile." + _tiles[_i];
                //console.log(_tiles[_i]);
                //document.getElementsByClassName(_tiles[_i]).style.backgroundPosition = _x + " " + _y;
                _tileStyle.push(_classname + " {background-position: " + _x_px + " " + _y_px + " !important} ");
            }
        }
        _tileStyle.push(".tile {width: " + s.m.tileSize + "px !important; height: " + s.m.tileSize + "px !important; background-size:" + _slider_width + "px;} ");
        _tileStyle.push("." + s.m.emptyTile + " {background: #666666 !important;} ");
        _tileStyle.push(".gameBoard {width: " + _slider_width + "px !important;}");
        _tileStyle.push("#source_holder {width: " + _slider_width + "px !important;height: " + _slider_width + "px !important;background-size:" + _slider_width + "px;}");
        _tileStyle.push(".helpText {max-width: " + _slider_width + "px !important;}");
        style.innerHTML = _tileStyle.join("\n");
        //console.log(_tileStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
        
	s.m.timeElapsed = 0; // Time in seconds
    };
})(window,slider);