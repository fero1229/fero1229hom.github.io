document.addEventListener("DOMContentLoaded", function () {
	var configMoon = {
		lang: 'en', // 'ca' 'de' 'en' 'es' 'fr' 'it' 'pl' 'pt' 'ru' 'zh' (*)
		month: new Date().getMonth() + 1, // 1  - 12
		year: new Date().getFullYear(),
		size: 20, //pixels
		lightColor: "#FFFF88", //CSS color
		shadeColor: "#111111", //CSS color
		sizeQuarter: 20, //pixels
		texturize: false //true - false
	}
	for (j = 2; j < 9; j++) {
		configMoon.LDZ = new Date(configMoon.year, configMoon.month - 1, j) / 1000
		loadMoonPhasesDay(configMoon, j)
	}
	for (l = 1; l < 25; l++) {
		configMoon.LDZ = new Date(configMoon.year, configMoon.month - 1, 1) / 1000
		loadMoonPhasesHour(configMoon, l)
	}


})

function loadMoonPhasesDay(obj, proba) {
	var k = proba
	var gets = []
	for (var i in obj) {
		gets.push(i + "=" + encodeURIComponent(obj[i]))
	}
	var xmlhttp = new XMLHttpRequest()
	var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&")
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var moon = JSON.parse(xmlhttp.responseText)
			day(moon, k)
		}
	}
	xmlhttp.open("GET", url, true)
	xmlhttp.send()
}

function loadMoonPhasesHour(obj, proba) {
	var k = proba
	var gets = []
	for (var i in obj) {
		gets.push(i + "=" + encodeURIComponent(obj[i]))
	}
	var xmlhttp = new XMLHttpRequest()
	var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&")
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var moon = JSON.parse(xmlhttp.responseText)
			hour(moon, k)
		}
	}
	xmlhttp.open("GET", url, true)
	xmlhttp.send()
}

function day(moon, proba1) {
	var k = proba1
	var day = new Date().getDate()
	var dayWeek = moon.phase[day].dayWeek
	var html = "<div class='moond'" + k + ">"
	
	/*html += "<div>" + moon.nameDay[dayWeek] + "</div>"
	html += "<div>" + day + " " + moon.monthName + " " + moon.year + "</div>"*/
	html += moon.phase[day].svg
	/*html+="<div>"+Math.round(moon.phase[day].lighting)+"%</div>"*/
	/*html+="<div>"+moon.phase[day].phaseName + " "+ Math.round(moon.phase[day].lighting)+"%</div>"
	html+="</div>"*/
	document.getElementById("moond" + k).innerHTML = html
	
}

function hour(moon, proba2) {
	var k = proba2
	var day = new Date().getDate()
	var dayWeek = moon.phase[day].dayWeek
	var html = "<div class='moon'>"
	/*html += "<div>" + moon.nameDay[dayWeek] + "</div>"
	html += "<div>" + day + " " + moon.monthName + " " + moon.year + "</div>"*/
	html += moon.phase[day].svg
	/*html+="<div>"+Math.round(moon.phase[day].lighting)+"%</div>"*/
	/*html+="<div>"+moon.phase[day].phaseName + " "+ Math.round(moon.phase[day].lighting)+"%</div>"
	html+="</div>"*/
	document.getElementById("moon" + k).innerHTML = html
}