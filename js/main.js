let cityName = "Székesfehérvár";
let key = "a471a11e3e038009ffa23b86a79d7814";
var link = "";
var link_trend = "";
var link_time = "";
var flag_link = "";
var time = new Date().getHours();
var lat = "";
var lon = "";
var flag = 0;


//Getting Geo Location
function getLocation() {
	navigator.geolocation.getCurrentPosition(showPosition);
}
function showPosition(position) {
	window.lat = position.coords.latitude;
	window.lon = position.coords.longitude;
	actualDay();
}


// Weather
function getWeather(weather, sraise, sset, ltime) {
	if (weather == "Haze") {
		if (ltime > sraise && ltime < sset)
			return "/lib/Resources/cloudy-day-3.svg"
		if (ltime > sraise + 86400 && ltime < sset + 86400)
			return "/lib/Resources/cloudy-day-3.svg"
		if (ltime > sset && ltime < sraise + 86400)
			return "/lib/Resources/cloudy-night-3.svg"
		if (ltime > sset + 86400)
			return "/lib/Resources/cloudy-night-3.svg"
	}
	else if (weather == "Clouds") {
		return "/lib/Resources/cloudy.svg"
	}
	else if (weather == "Rain") {
		return "/lib/Resources/rainy-6.svg"
	}
	else if (weather == "Mist") {
		return "/lib/Resources/snowy-6.svg"
	}
	else if (weather == "Clear") {
		if (ltime > sraise && ltime < sset)
			return "/lib/Resources/day.svg"
		if (ltime > sraise + 86400 && ltime < sset + 86400)
			return "/lib/Resources/day.svg"
		if (ltime > sset && ltime < sraise + 86400)
			return "/lib/Resources/night.svg"
		if (ltime > sset + 86400)
			return "/lib/Resources/night.svg"
	}
	else if (weather == "Smoke") {
		return "/lib/Resources/snowy-6.svg"
	}
	else if (weather == "Drizzle") {
		return "/lib/Resources/rainy-7.svg"
	}
	else if (weather == "Thunderstorm") {
		return "/lib/Resources/thunder.svg"
	}
	return;
}

function actualDay() {
	//if (document.getElementById('city').style.visibility == 'visible') { cityName = document.getElementById('city').value; }
	//ext_str = "";

	if (cityName == "") {
		link = "https://api.openweathermap.org/data/2.5/weather?lat=" + window.lat + "&lon=" + window.lon + "139&units=metric&apikey=" + key;
	}
	else if (cityName != "") {
		link = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&apikey=" + key;  //API Request Link
	}
	link_trend = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&APPID=" + key;
	var request = new XMLHttpRequest();
	request.open('GET', link, true);

	request.onload = function () {
		var obj = JSON.parse(this.response);
		document.getElementById('blur-bg').style.visibility = 'visible';
		var lastupdate_unix = obj.dt;
		var lastupdate_human = convert_unix(lastupdate_unix);
		document.getElementById('last_update').innerHTML = lastupdate_human;
		if (request.status >= 200 && request.status < 400) {
			var temp = obj.main.temp;
			var tempmin = obj.main.temp_min;
			var tempmax = obj.main.temp_max;
			var cityName = obj.name;
			var country = obj.sys.country;
			flag_link = "https://www.countryflags.io/" + country + "/shiny/32.png";
			var weat = obj.weather[0].description;
			var press = obj.main.pressure;
			var hum = obj.main.humidity;
			if (new Date(obj.sys.sunrise * 1000).getMinutes() < 10) {
				var sunr = "0" + new Date(obj.sys.sunrise * 1000).getHours() + ":0" + new Date(obj.sys.sunrise * 1000).getMinutes();
			}
			if (new Date(obj.sys.sunrise * 1000).getMinutes() >= 10) {
				var sunr = "0" + new Date(obj.sys.sunrise * 1000).getHours() + ":" + new Date(obj.sys.sunrise * 1000).getMinutes();
			}
			var suns = new Date(obj.sys.sunset * 1000).getHours() + ":" + new Date(obj.sys.sunset * 1000).getMinutes();

			var lat = obj.coord.lat;
			var lon = obj.coord.lon;
			var color = getColor(temp);
			var speed = obj.wind.speed * 3.6;
			speed = speed.toFixed(1);
			//document.getElementById('Temperature').style.visibility = "visible";
			document.getElementById('Sunrise').innerHTML = sunr;
			document.getElementById('Sunset').innerHTML = suns;
			document.getElementById('Temperature').className = color;
			document.getElementById('Temperature').innerHTML = temp + "°C";
			document.getElementById('City').innerHTML = cityName;

			//document.getElementById('flag').style.visibility = "visible";
			document.getElementById('flag').src = flag_link;
			document.getElementById('Feelslike').innerHTML = obj.main.feels_like + "°C";
			document.getElementById('Cloudness').innerHTML = weat;
			document.getElementById('Image').src = getWeather(obj.weather[0].main, obj.sys.sunrise, obj.sys.sunset, obj.dt);
			document.getElementById('Wind').innerHTML = speed + " km/h";
			document.getElementById('windImg').style.transform = "rotate(" + (obj.wind.deg - 45) + "deg)";
			/*document.getElementById('htemp').innerHTML = tempmax;
			document.getElementById('ltemp').innerHTML = tempmin;
			document.getElementById('htemp').innerHTML = obj.main.temp_min + "°C";
			document.getElementById('ltemp').innerHTML = obj.main.temp_max + "°C";
			document.getElementById('Pressure').innerHTML = press + " hpa";
			document.getElementById('Humidity').innerHTML = hum + " %";*/
			/*document.getElementById('Geocoords').innerHTML = "[ " + lat + " , " + lon + " ]";*/
		}
		else {
			console.log("The city doesn't exist! Kindly check");
		}
		lon = obj.coord.lon;
		lat = obj.coord.lat;
		actualHourly(cityName);
		forecastDay(cityName);
	}
	request.send();

	return;

}

function actualHourly(cityName) {
	// cityName = document.getElementById('city').value;
	//link_trend = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&APPID=" + key;
	link_trend = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + key;
	var request1 = new XMLHttpRequest();
	request1.open('GET', link_trend, true);
	request1.onload = function () {
		var obj = JSON.parse(this.response);
		var tph = obj.hourly;
		var sunr = new Date(obj.current.sunrise * 1000).getHours() + ":" + new Date(obj.current.sunrise * 1000).getMinutes();
		var suns = new Date(obj.current.sunset * 1000).getHours() + ":" + new Date(obj.current.sunset * 1000).getMinutes();


		if (request1.status >= 200 && request1.status < 400) {
			var icon = [];
			for (var i = 0; i < 25; i++) {
				icon.push(obj.hourly[i].weather[0].icon);
			}
			hourlyForcast(icon);
			for (var i = 1; i < 25; i++) {

				if (new Date(obj.hourly[i].dt * 1000).getHours() < 10) {
					document.getElementById("dt" + i).innerHTML = "0" + convert_unix_hh_pp(obj.hourly[i].dt);
				}
				if (new Date(obj.hourly[i].dt * 1000).getHours() >= 10) {
					document.getElementById("dt" + i).innerHTML = convert_unix_hh_pp(obj.hourly[i].dt);
				}
				if (icon[i] !== "01n") {
					document.getElementById("im" + i).src = getWeather(obj.hourly[i].weather[0].main, obj.current.sunrise, obj.current.sunset, obj.hourly[i].dt);
				}
				if (icon[i] == "01n") {
				}
				document.getElementById("temp" + i).className = getColor1(Math.round(((obj.hourly[i].temp) - 273.15) * 100) / 100, tempLine(tph, 25, "hourly")[i - 1]);
				document.getElementById("temp" + i).innerHTML = Math.round(((obj.hourly[i].temp) - 273.15) * 100) / 100 + "°C";
			}
		}
		else {
			console.log("Problem in accessing JSON" + request1.status);
		}

	}
	request1.send();
}

function forecastDay(cityName) {

	// cityName = document.getElementById('city').value;
	//link_trend = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&APPID=" + key;
	link_trend = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + key;
	var request2 = new XMLHttpRequest();
	request2.open('GET', link_trend, true);
	request2.onload = function () {
		var obj = JSON.parse(this.response);
		var tpd = obj.daily;
		var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var sunrd = new Date(obj.current.sunrise * 1000).getHours() + ":" + new Date(obj.current.sunrise * 1000).getMinutes();
		var sunsd = new Date(obj.current.sunset * 1000).getHours() + ":" + new Date(obj.current.sunset * 1000).getMinutes();
		if (request2.status >= 200 && request2.status < 400) {
			for (var i = 1; i < 8; i++) {
				document.getElementById("dtd" + i).innerHTML = weekdays[(new Date(obj.daily[i].dt * 1000)).getUTCDay()];
				document.getElementById("imd" + i).src = getWeather(obj.daily[i].weather[0].main, obj.daily[i].sunrise, obj.daily[i].sunset, obj.daily[i].dt);

				document.getElementById("tempd" + i).className = getColor1(Math.round(((obj.daily[i].temp.max) - 273.15) * 100) / 100, tempLine(tpd, 8, "max")[i - 1]);
				document.getElementById("tempd" + i).innerHTML = Math.round(((obj.daily[i].temp.max) - 273.15) * 100) / 100 + "°C";

				/*document.getElementById("tempd" + i + "2").className = getColor1(Math.round(((obj.daily[i].temp.eve) - 273.15) * 100) / 100, tempLine(tpd, 8, "max")[i - 1] + "_2");
				document.getElementById("tempd" + i + "2").innerHTML = Math.round(((obj.daily[i].temp.eve) - 273.15) * 100) / 100 + "°C";*/
				
				document.getElementById("tempd" + i + "3").className = getColor1(Math.round(((obj.daily[i].temp.min) - 273.15) * 100) / 100, tempLine(tpd, 8, "max")[i - 1] + "_3");
				document.getElementById("tempd" + i + "3").innerHTML = Math.round(((obj.daily[i].temp.min) - 273.15) * 100) / 100 + "°C";
			}
		}
		else {
			console.log("Problem in accessing JSON" + request2.status);
		}
	}
	request2.send();
}


//color code for temperature
function getColor(gc) {
	if (gc < 16)
		return "cool";
	if (gc >= 16 && gc < 30)
		return "mild";
	if (gc >= 30 && gc < 33)
		return "warm";
	if (gc >= 33 && gc < 35)
		return "hot";
	if (gc >= 35)
		return "vhot";
}

//color forcast code for temperature
function getColor1(gc1, sor) {
	if (gc1 < 16)
		return "cool" + sor;
	if (gc1 >= 16 && gc1 < 30)
		return "mild" + sor;
	if (gc1 >= 30 && gc1 < 33)
		return "warm" + sor;
	if (gc1 >= 33 && gc1 < 35)
		return "hot" + sor;
	if (gc1 >= 35)
		return "vhot" + sor;
}




function convert_unix(time) {				// This will convert EPOCH time or Unix time into Human readable time
	var date = new Date(time * 1000);
	var day = "0" + date.getDate();
	var mon = date.getMonth();
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var yr = date.getFullYear();
	var hours = date.getHours();
	var min = "0" + date.getMinutes();
	return day.substr(-2) + "-" + months[mon] + "-" + yr + ", " + hours + ":" + min.substr(-2);
}


function convert_unix_hh_pp(time) {
	var date = new Date(time * 1000);
	var hours = date.getHours();
	var min = "0" + date.getMinutes();
	return hours + ":" + min.substr(-2);
}


function tempLine(tp, tL, temp) {
	var tp1 = [];
	var tp2 = [];
	var tp3 = [];
	var tp11 = [];
	var tp22 = [];
	for (var i = 1; i < tL; i++) {
		if (temp == "hourly") {
			tp1.push(Math.round(((tp[i].temp) - 273.15) * 100) / 100);
			tp2.push(Math.round(((tp[i].temp) - 273.15) * 100) / 100);
		}
		if (temp == "max") {
			tp1.push(Math.round(((tp[i].temp.max) - 273.15) * 100) / 100);
			tp2.push(Math.round(((tp[i].temp.max) - 273.15) * 100) / 100);
		}
		if (temp == "eve") {
			tp1.push(Math.round(((tp[i].temp.eve) - 273.15) * 100) / 100);
			tp2.push(Math.round(((tp[i].temp.eve) - 273.15) * 100) / 100);
		}
		if (temp == "min") {
			tp1.push(Math.round(((tp[i].temp.min) - 273.15) * 100) / 100);
			tp2.push(Math.round(((tp[i].temp.min) - 273.15) * 100) / 100);
		}

		tp11.push(i);
		tp2.sort(function (a, b) { return b - a });
	}

	for (var j = 0; j < tL - 1; j++) {
		tp22.push(j + 1);
		tp3.push(j + 1);
		if (tp2[j] == tp2[j - 1] && j > 0) {
			tp22[j] = (tp22[j - 1]);
			tp3[j] = (tp3[j - 1]);
		}
		if (tp2[j] !== tp2[j - 1] && j > 0) {
			tp22[j] = tp22[j - 1] + 1;
			tp3[j] = tp3[j - 1] + 1;
		}
	}

	for (var i = 0; i < tL - 1; i++) {
		for (var j = 0; j < tL - 1; j++) {
			if (tp1[i] == tp2[j]) {
				tp3[i] = tp22[j];
			}
		}
	}
	return tp3;
}





// Local time
/*function getLocalTime(lat,lon){
	// var ext_str;
	link_time = "https://api.timezonedb.com/v2.1/get-time-zone?key=HDYY2MHLPCQV&format=json&by=position&lng="+lon+"&lat="+lat;
	var request3 = new XMLHttpRequest();
	request3.open('GET',link_time,true);
	request3.onload = function(){
		var obj = JSON.parse(this.response);
		if (request3.status >= 200 && request3.status < 400) {
			// var ext_str = "";
			var ext = obj.abbreviation; console.log(ext);
			ext_str = JSON.stringify(ext); console.log(ext_str);
			/*document.getElementById('last_update').innerHTML += " "+ext;
			document.getElementById('sr').innerHTML += " "+ext;
			document.getElementById('ss').innerHTML += " "+ext;
			document.getElementById("date1").innerHTML += " "+ext;
			document.getElementById("date2").innerHTML += " "+ext;
			document.getElementById("date3").innerHTML += " "+ext;
			document.getElementById("date4").innerHTML += " "+ext;
			document.getElementById("date5").innerHTML += " "+ext;
			document.getElementById("date6").innerHTML += " "+ext;
			document.getElementById("date7").innerHTML += " "+ext;
			document.getElementById("date8").innerHTML += " "+ext;*/
// return ext_str;
/*}
else{
	Window.alert("Some thing went wrong with api call");
}
}
request3.send();
return window.ext_str;
}*/


function hourlyForcast(icon) {
	let horScroll = createAnyElement("div", {
		class: "horizontal-scroll-wrapper squares",
		/*style: "margin: 0 0 0 20px"*/
	});

	for (i = 1; i <= 24; i++) {
		let div = createAnyElement("div");
		horScroll.appendChild(div);

		let divH = createAnyElement("div", {
			class: "hourly"
		});
		div.appendChild(divH);
		let divDt = createAnyElement("p", {
			id: "dt" + i,
			class: "dt"
		});
		divH.appendChild(divDt);
		if (icon[i] == "01n") {
			let divMoon = createAnyElement("div", {
				id: "moon" + i,
			});
			divH.appendChild(divMoon);
		}
		if (icon[i] !== "01n") {
			let divIm = createAnyElement("div");
			let divIm1 = createAnyElement("img", {
				id: "im" + i,
				class: "im"
			});
			divIm.appendChild(divIm1);
			divH.appendChild(divIm);
		}
		let pTemp = createAnyElement("p", {
			id: "temp" + i,
		});
		divH.appendChild(pTemp);

	}
	document.body.appendChild(horScroll);
}

function createAnyElement(name, attributes) {
	let element = document.createElement(name);
	for (let k in attributes) {
		element.setAttribute(k, attributes[k]);
	}
	return element;
}
