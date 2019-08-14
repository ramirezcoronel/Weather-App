window.addEventListener('load', ()=>{
	const locationBox = document.querySelector('.location');
	const degreeBox = document.querySelector('.deg');
	const degreeSection = document.querySelector('.deg-section')
	const degress = document.querySelector('.deg-type');
	const summaryBox = document.querySelector('.summary');

	let lat;
	let long;

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position => {
			long = position.coords.longitude;
			lat = position.coords.latitude;

			const proxy = `https://cors-anywhere.herokuapp.com/`;
			const api = `${proxy}https://api.darksky.net/forecast/a6596f279200c3e40f033a7a2ceb5d06/${lat},${long}`;

			// GET DATA 
			fetch(api)
				.then(data => data.json())
				.then(data => {
					const {temperature, summary, icon} = data.currently;

					console.log(data)

					// Celsius formula
					let celsius = Math.floor((temperature - 35) * (5/9));

					display(celsius, summary, data.timezone);

					setColors(celsius);

					setIcon(icon, document.getElementById('icon'));

					degreeSection.addEventListener('click',()=>{
						changeDegree(temperature,celsius);
					})
				})
		})

	}else{
		alert('Oops.. looks like something went wrong.');
	}
	// Display data
	function display(temperature,summary, location){
		locationBox.textContent = location;
		degreeBox.textContent = temperature;
		summaryBox.textContent = summary;
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
			root.style.setProperty('--main', '#FDC830');
			root.style.setProperty('--secondary', '#F37335');
		}
	}

	// Skycons Icons
	function setIcon(icon,iconID){
		const skycons = new Skycons({"color": "white"});
		let currentIcon = icon.replace(/-/g,"_").toUpperCase();
		skycons.set(iconID, Skycons[currentIcon]);
		skycons.play();
	}

	// change from C to F and viceversa
	function changeDegree(F,C){
		if(degress.textContent === 'C°'){
			degress.textContent = 'F';
			degreeBox.textContent = F;
		}else{
			degress.textContent = 'C°';
			degreeBox.textContent = C;
		}
	}
})

