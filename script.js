// DOM Elems
const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = document.querySelector('.input__cities-from'),
	dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
	inputCitiesTo = document.querySelector('.input__cities-to'),
	dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
	inputDateDepart = document.querySelector('.input__date-depart');


// data
const CITIES_API = 'data/cities.json',
	PROXY = 'https://cors-anywhere.herokuapp.com/',
	API_HEY = 'be0543f1095ab466ccebdbe319b11518',
	CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload?currency=usd&origin=IEV&destination=TLV&depart_date=2020-06-04&return_date=2020-06-14&one_way=false';

let city = [];

const getData = (url, callback) => {
	const request = new XMLHttpRequest();

	request.open('GET', url);

	request.addEventListener('readystatechange', () => {
		// status 4 - eto otvet ot servera
		if (request.readyState !== 4) return;
		if (request.status === 200) {
			callback(request.response);
		} else {
			console.error(request.status);
		};
	})

	request.send();
}

// show CityList
const showCity = (input, list) => {
	list.innerHTML = '';
	if (input.value !== '') {
		const filterCity = city.filter((item) => {
			return item.name.toLowerCase().includes(input.value.toLowerCase());
		})
		filterCity.forEach((item) => {
			const li = document.createElement('li');
			li.classList.add('dropdown__city');
			li.textContent = item.name;
			list.append(li);
		})
	}
};


// mark City
const handlerCity = (event, field, parent) => {
	const target = event.target;
	if (target.tagName.toLowerCase() === "li") {
		field.value = target.textContent;
		parent.textContent = '';
	}
}


// list cities from
inputCitiesFrom.addEventListener('input', () => {
	showCity(inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesFrom.addEventListener('click', (e) => {
	handlerCity(e, inputCitiesFrom, dropdownCitiesFrom);
});


// list cities to
inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo);
});
dropdownCitiesTo.addEventListener('click', (e) => {
	handlerCity(e, inputCitiesTo, dropdownCitiesTo);
});


// functions calls
getData(CITIES_API, (data) => {
	city = JSON.parse(data).filter(item => item.name);
});

getData(PROXY + CALENDAR, (data) => {
	reys = JSON.parse(data);
	console.log(reys);
});
