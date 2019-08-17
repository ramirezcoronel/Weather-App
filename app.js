window.addEventListener('load', ()=>{
	const locationBox = document.querySelector('.location');
	const degreeBox = document.querySelector('.deg');
	// BUTTONS
	const cBtn = document.querySelector('.c-btn');
	const fBtn = document.querySelector('.f-btn');
	// INFO INSIDE WEATHER BOX
	const degress = document.querySelector('.deg-type');
	const summaryBox = document.querySelector('.summary');
	// SELECTING ALL HIDDEN ELEMENTS
	const hiddenElements = document.querySelectorAll('.hidden');
	// SKYCONS OBJECT
	const skycons = new Skycons({"color": "white"});

	let lat;
	let long;

	
	// function to fetch data
	const positionSucces = (position) => {
		long = position.coords.longitude;
		lat = position.coords.latitude;

		const proxy = `https://cors-anywhere.herokuapp.com/`;
		const api = `${proxy}https://api.darksky.net/forecast/a6596f279200c3e40f033a7a2ceb5d06/${lat},${long}`;
 
		fetch(api)
			.then(data => data.json())
			.then(data => {
				const {temperature, summary, icon, humidity, precipProbability, windSpeed} = data.currently;

				removeHidden(hiddenElements);

				console.log(data)
				displayWeatherBox(temperature,summary,data.timezone,icon);
				
				displayWeatherInfo(humidity,precipProbability,windSpeed);


			})
	} // function to show errors occured
	const positionError = (error)=>{
		document.querySelector('.box').classList.remove('hidden');
		summaryBox.textContent = error.message;
		degreeBox.textContent = 'Make sure to allow ubication';
	}

	// Calling functions that fetch data
	navigator.geolocation.getCurrentPosition(positionSucces, positionError);


	// FUNCTIONS TO DISPLAY WEATHER BOX DATA
	function displayWeatherBox(temp,summary,timezone,icon){
		// Celsius formula
		let celsius = Math.floor((temp - 35) * (5/9));

		displayWeatherData(celsius, summary, timezone);

		setColors(celsius);

		setIcon(icon, document.getElementById('icon'));

		cBtn.addEventListener('click',()=>{
			changeDegree(temp,celsius, cBtn);
		})
		fBtn.addEventListener('click',()=>{
			changeDegree(temp,celsius, fBtn);
		})
	}

	// display function
	function displayWeatherData(temperature,summary, location){
		// display data
		locationBox.textContent = location;
		degreeBox.textContent = temperature;
		summaryBox.textContent = summary;
		degress.textContent = 'C°';
	}

	//Color palette depending on weather
	function setColors(weather){
		let root = document.documentElement;
		if(weather > 25){
			root.style.setProperty('--main', '#eb3349');
			root.style.setProperty('--secondary', '#f45c43');
		}else if(weather < 20){
			root.style.setProperty('--main', '#4ca1af ');
			root.style.setProperty('--secondary', '#c4e0e5');
		}else{
			root.style.setProperty('--main', '#FFD200');
			root.style.setProperty('--secondary', '#F7971E');
		}
	}

	// Skycons Icons
	function setIcon(icon,iconID){
		let currentIcon = icon.replace(/-/g,"_").toUpperCase();
		skycons.set(iconID, Skycons[currentIcon]);
		skycons.play();
	}

	// change from C to F and viceversa
	function changeDegree(F,C,element){
		if(element.id !== "activaded"){
			if(element.className === "c-btn"){
				document.querySelector('#activaded').id = "";
				degreeBox.textContent = C;
				degress.textContent = "C°";
				element.id = 'activaded';
			}else{
				document.querySelector('#activaded').id = "";
				degreeBox.textContent = F;
				degress.textContent = "F";
				element.id = 'activaded';
			}
		}
	}

	function removeHidden(element){
		element.forEach((el)=>{
			el.classList.remove('hidden')
		})
	}

	// FUNCTIONS TO DISPLAY WEATHER INFO DATA
	function displayWeatherInfo(humidity,precipProb,windSpeed){

		let infoBox = document.querySelectorAll('.info-text');
		let infoData = [humidity * 100 + "%",precipProb * 100 + "%",windSpeed + "mph"];

		infoBox.forEach((box,index)=>{
			box.textContent = infoData[index];
		})
	}
})

