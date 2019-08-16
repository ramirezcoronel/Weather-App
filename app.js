window.addEventListener('load', ()=>{
	const locationBox = document.querySelector('.location');
	const degreeBox = document.querySelector('.deg');
	// const degreeSection = document.querySelector('.deg-section')

	const cBtn = document.querySelector('.c-btn');
	const fBtn = document.querySelector('.f-btn');

	const degress = document.querySelector('.deg-type');
	const summaryBox = document.querySelector('.summary');

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
				const {temperature, summary, icon} = data.currently;

				console.log(data)

				// Celsius formula
				let celsius = Math.floor((temperature - 35) * (5/9));

				display(celsius, summary, data.timezone);

				setColors(celsius);

				setIcon(icon, document.getElementById('icon'));

				cBtn.addEventListener('click',()=>{
					changeDegree(temperature,celsius, cBtn);
				})
				fBtn.addEventListener('click',()=>{
					changeDegree(temperature,celsius, fBtn);
				})
			})
	} // function to show errors occured
	const positionError = (error)=>{
		summaryBox.textContent = error.message;
		degreeBox.textContent = 'Make sure to allow ubication';
	}

	// Calling functions that fetch data
	navigator.geolocation.getCurrentPosition(positionSucces, positionError);

	// Display data
	function display(temperature,summary, location){
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
			root.style.setProperty('--main', '#FDC830');
			root.style.setProperty('--secondary', '#F37335');
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
})

