/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
var slider = {};

//slider.logLevel = 4;
slider.tileSize = 4;
slider.enable = true;
slider.enableSuffle = true;
slider.tileSizeMin = 3;
slider.tileSizeMax = 8;
slider.shuffle_weight = 100;

slider.enableLogStep = false;

// -----------------------------------------------

slider.m = {};
slider.v = {};
slider.c = {};


slider.isIE = (navigator.appName.indexOf("Microsoft") !== -1)?true:false;
slider.userAgent = navigator.userAgent.toLowerCase();
if(slider.userAgent.search("iphone") > -1 || slider.userAgent.search("ipad") > -1 || slider.userAgent.search("android") > -1){
	slider.isMobile = true;
}
slider.timerDiv = "";

slider.stopTimer = false;


slider.helpclick = function(msg){
    if(slider.v.puzzle) {
        slider.v.puzzle.layoutmanager(msg);
        if (msg === "game") {
            document.getElementById("game").style.display = "none";
            document.getElementById("source").style.display = "block";
        }
        else if (msg === "source") {
            document.getElementById("source").style.display = "none";
            document.getElementById("game").style.display = "block";
        }
        else if (msg === "newgame") {
            location.href='index.html?size=' + slider.tileSize + '&tmp_img=' + slider.imageURL;
        }
        else if (msg === "share") {
            var _time = document.getElementById("timeElapsed").innerText;
            var _step = document.getElementById("stepElapsed").innerText;
            
            var _title = "我做了一塊" + slider.tileSize + "x" + slider.tileSize + "的拼圖，歡迎來挑戰！";
            if (slider.enable === false) {
                _title = "我花了" + _time + "跟用" + _step + "步就完成了這張" + slider.tileSize + "x" + slider.tileSize + "的拼圖，你做得到嗎？";
            }
            
            ga('send', 'event', "share", "url:" + slider.imageURL, _title);
            
            //var _title = "aaa";
            _title = encodeURIComponent(_title);
            //alert("分享!!" + _time);
            var _u = location.href; 
            //_u = "http://www.google.com.tw";
            _u = encodeURIComponent(_u);
            
            var _description = "滑塊拼圖遊戲";
            _description = encodeURIComponent(_description);
            
            var _picture = slider.imageURL;
            if (_picture !== undefined) {
                if (_picture === "demo.png") {
                    _picture = "https://pulipulichen.github.io/HTML5-Client-side-Image-puzzle/demo.png";
                }
                
                _picture = encodeURIComponent(_picture);
            }
            
            
            var _url = "http://www.facebook.com/sharer.php?u=" + _u + "&title=" + _title + "&description=" + _description;
            if (_picture !== undefined) {
                _url = _url + "&picture=" + _picture;
            }
            
            // http://www.facebook.com/sharer.php?s=100&p[title]=titleheresexily&p[url]=http://www.google.com&p[summary]=mysexysummaryhere&p[images][0]=http://www.urltoyoursexyimage.com
            
            window.open(_url, "", 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
            /*
            var fburl = 'http://www.google.com.tw';
            var fbimgurl = '';
            var fbtitle = 'Your title';
            var fbsummary = "your description";
            var sharerURL = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURI(fburl) + "&title=" + encodeURI(fbtitle) + "&caption=" + encodeURI(fbsummary) + "&quote=qqqqqq&description=dddddd";
            window.open(
              sharerURL,
              'facebook-share-dialog', 
              'width=626,height=436'); 
            return  false;
            */
        }
    }
};

slider.log = function(message, type){
    if (typeof (console) === 'undefined' 
            || console === null 
            || !slider.logLevel) {
        return;
    }
    try {
        if (type === "error")
            console.error("slider: " + message);
        else if (type === "warn" && slider.logLevel >= 2)
            console.warn("slider: " + message);
        else if (type === "info" && slider.logLevel >= 3)
            console.info("slider: " + message);
        else if (slider.logLevel >= 4)
            console.log("slider: " + message);
    } catch (e) {
    }
};

slider.initGame = function(){
    if (typeof($) !== "function" || typeof(slider.model) !== "function" || typeof(slider.controller) !== "function") {
        setTimeout(function () {
            slider.initGame();
        }, 100);
        return;
    }
    
    slider.model();
    slider.controller();
    slider.v.puzzle = new slider.v.Box();
    slider.v.puzzle.paintPuzzle();
    
    $(".tileSize").text(slider.tileSize);
    
    if (slider.imageURL === undefined) {
        $(".share").hide();
    }
    else {
        $(".share").show();
    }
    //console.log("initGame");
};


slider.generateGame = function () {
    console.log("generateGame");
    var s = slider;
    
    var alltiles = [];
    for (var _x = 0; _x < slider.tileSize; _x++) {
        for (var _y = 0; _y < slider.tileSize; _y++) {
            alltiles.push("tile" + _x + "" + _y);
        }
    }
    /*
    var alltiles = ["tile00", "tile01", "tile02", "tile03",
        "tile10", "tile11", "tile12", "tile13",
        "tile20", "tile21", "tile22", "tile23",
        "tile30", "tile31", "tile32", "tile33"];
    */
    /*
    var alltiles = ["tile00", "tile01", "tile02",
        "tile10", "tile11", "tile12", 
        "tile20", "tile21", "tile22"];
    */

    for (var i = 0; i < s.c.sliderSize; i++) {
        for (var j = 0; j < s.c.sliderSize; j++) {
            var index = Math.floor(Math.random() * alltiles.length),
                    tile = alltiles[index];
            slider.log("len " + alltiles.length + " - tile=" + tile, "info");
            alltiles.splice(index, 1);
            s.m.state[i][j] = tile;
            if (tile === s.m.emptyTile) {
                s.m.emptyRef["x"] = i;
                s.m.emptyRef["y"] = j;
            }
        }
    }
};

var initTimer = function(){

    slider.timer = setInterval(function () {
        slider.m.timeElapsed++;

        var secs = slider.m.timeElapsed,
                hours = Math.floor(secs / (60 * 60)),
                divisor_for_minutes = secs % (60 * 60),
                minutes = Math.floor(divisor_for_minutes / 60),
                divisor_for_seconds = divisor_for_minutes % 60,
                seconds = Math.ceil(divisor_for_seconds);
        slider.timerDiv.innerHTML = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }, 1000);
	
};

slider.readFileAsDataURL = function(file) {
	var reader = new FileReader();
	reader.onload = function (event) {
		slider.log(event.target,"info");
		document.getElementById("source_holder").style.backgroundImage = 'url(' + event.target.result + ')';
		
		 var mysheet=document.styleSheets[0],
		 	myrules =[];
		 
		 if (mysheet.cssRules) myrules = mysheet.cssRules;
		 else if (mysheet.rules) myrules = mysheet.rules;
		 	
		 
	    for (var i=0; i<myrules.length; i++){
	    	
	    	if(myrules[i].selectorText.toLowerCase()==".tile"){
	    		myrules[i].style.backgroundImage ="url('"+event.target.result+"')";
	    		slider.uploadContainer.className = "hide";
	    		document.getElementById("mainContent").className = "";
	    		slider.initGame();
	    		initTimer();
	    		break;
	    	}
	    }
	};
	slider.log(file,"info");
	reader.readAsDataURL(file);
};


slider.attachDragNDrop = function(){
	
	var holder = document.getElementById("dragContainer");
	slider.holder = holder;
	slider.uploadContainer = document.getElementById("uploadContainer");
	
	document.getElementById("imageholder").onchange = function() {
		slider.readFileAsDataURL(this.files[0]);
     };

	if (typeof window.FileReader === 'undefined') {
		slider.uploadContainer.innerHTML = "Your browser is not HTML5  File API compatible, Please use latest version of your browser or other browser.";
	}

	holder.ondragover = function () { this.className = 'hover'; return false; };
	holder.ondragend = function () { this.className = ''; return false; };
	holder.ondrop = function (e) {
		this.className = '';
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		slider.readFileAsDataURL(file);
		return false;
	};

};

slider.imageURL = undefined;
slider.readURL = function (url) {
    //url = unescape(url);
    var _source_holder = document.getElementById("source_holder");
    if (_source_holder === undefined || _source_holder === null) {
        setTimeout(function () {
            slider.readURL(url);
        }, 1000);
        return;
    }
    
    console.log(getQueryVariable("tmp_img"));
    if (getQueryVariable("tmp_img") !== undefined) {
        document.getElementById("url_input").value = getQueryVariable("tmp_img");
    }
    
    if (url === undefined || (url.match(/\.(jpeg|jpg|gif|png)$/) === null)) {
        //console.log(url);
        if (url !== undefined && typeof(url) === "string" && url !== "undefined") {
            alert("這是一個無效的網址喔: " + url);
        }
        return;
    }
    
    url = unescape(url);
    _source_holder.style.backgroundImage = 'url(' + url + ')';
    slider.imageURL = url;
    document.getElementById("url_input").value = url;

    var mysheet = document.styleSheets[0],
            myrules = [];

    if (mysheet.cssRules)
        myrules = mysheet.cssRules;
    else if (mysheet.rules)
        myrules = mysheet.rules;

    for (var i = 0; i < myrules.length; i++) {
        if (myrules[i].selectorText.toLowerCase() === ".tile") {
            myrules[i].style.backgroundImage = "url('" + url + "')";
            if (slider.uploadContainer === undefined) {
                slider.uploadContainer = document.getElementById("uploadContainer");
            }
            slider.uploadContainer.className = "hide";
            document.getElementById("mainContent").className = "";
            slider.initGame();
            initTimer();
            break;
        }
    }
};

slider.readDemo = function () {
    //slider.readURL("demo.png");
    location.href = "?img=demo.png&size=" + slider.getSelectTileSize();
};

slider.getSelectTileSize = function () {
    var _size = $('[name="tileSize"]:checked').val();
    _size = parseInt(_size, 10);
    return _size;
};

var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    //alert('Query Variable ' + variable + ' not found');
    return undefined;
};

slider.loadByParameter = function () {
    
    
    var _img = getQueryVariable("img");
    _img = unescape(_img);
    var _size = getQueryVariable("size");
    if (_size !== undefined) {
        slider.tileSize = parseInt(_size, 10);
        if (slider.tileSize < slider.tileSizeMin) {
            slider.tileSize = slider.tileSizeMin;
        }
        else if (slider.tileSize > slider.tileSizeMax) {
            slider.tileSize = slider.tileSizeMax;
        }
        //console.log(slider.tileSize);
        setTimeout(function () {
            var _size_input = document.getElementById('tileSize' + slider.tileSize);
            //console.log('tileSize' + slider.tileSize);
            if (_size_input !== null) {
                _size_input.checked = "checked";
            }
        }, 100);
    }
    if (_img !== undefined) {
        slider.readURL(_img);
    }
};

slider.calcSliderWidth = function () {
    var _len;
    var _width = $(window).width();
    var _height = $(window).height();
    
    var _padding = 20;
    if (_width < _height) {
        _len = _width - _padding;
    }
    else {
        _len = _height - _padding;
    }
    //console.log([_width, _height]);
    
    if (_len > 500) {
        _len = 500;
    }
    //console.log(_len);
    return _len;
};

slider.checkURLwork = function (_url) {
    var request;
    if(window.XMLHttpRequest)
        request = new XMLHttpRequest();
    else
        request = new ActiveXObject("Microsoft.XMLHTTP");
    request.open('GET', _url, false);
    request.send(); // there will be a 'pause' here until the response to come.
    // the object request will be actually modified
    if (request.status !== 200) {
        return false;
    }
    else {
        return true;
    }
};

setTimeout(function () {
    slider.loadByParameter();
    
    //slider.checkURLwork("demo1.png", function (_result) {
    //    alert(_result);
    //});
}, 0);
