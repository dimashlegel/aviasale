// DOM Elems
const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = document.querySelector('.input__cities-from'),
	dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
	inputCitiesTo = document.querySelector('.input__cities-to'),
	dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
	inputDateDepart = document.querySelector('.input__date-depart'),
	cheapestTicket = document.getElementById('cheapest-ticket'),
	otherCheapTickets = document.getElementById('other-cheap-tickets');

// data
const CITIES_API = 'data/cities.json',
	PROXY = 'https://cors-anywhere.herokuapp.com/',
	API_KEY = 'be0543f1095ab466ccebdbe319b11518',
	CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

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
			return item.name.toLowerCase().startsWith(input.value.toLowerCase());
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
};

// createCards

const getNameCity = (code) => {
	const objCity = city.find((item) => item.code === code);
	return objCity.name;
}

const getDepartDate = (date) => {
	return new Date(date).toLocaleString('ru', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

const getChanges = (num) => {
	if (num) {
		return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
	} else return 'Без пересадок'
}
// link on ticket
const getLinkAviasales = (data) => {
	// https://www.aviasales.ru/search/SVX2905KGD1

	let date = new Date(data.depart_date);
	let day = date.getDate();
	let linkDay = day < 10 ? '0' + day : day;
	let month = date.getMonth() + 1;
	let linkMonth = month < 10 ? '0' + month : month;

	let link = 'https://www.aviasales.ru/search/' + data.origin + linkDay + linkMonth + data.destination + '1';
	return link;
}

const createCard = (data) => {

	const ticket = document.createElement('article');
	ticket.classList.add('ticket');

	let deep = '';

	if (data) {
		console.log(data);

		deep = `
		<h3 class="agent">${data.gate}</h3>
		<div class="ticket__wrapper">
			<div class="left-side">
				<a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
					за ${Math.round(data.value, )}$</a>
			</div>
			<div class="right-side">
				<div class="block-left">
					<div class="city__from">Вылет из города
						<span class="city__name">${getNameCity(data.origin)}</span>
					</div>
					<div class="date">${getDepartDate(data.depart_date)}</div>
				</div>
		
				<div class="block-right">
					<div class="changes">${getChanges(data.number_of_changes)}</div>
					<div class="city__to">Город назначения:
						<span class="city__name">${getNameCity(data.destination)}</span>
					</div>
				</div>
			</div>
		</div>
		`;
	} else {
		deep = '<h3>Нет билетов на єту дату</h3>'
	}

	ticket.insertAdjacentHTML('afterbegin', deep);

	return ticket;

}

// renderCheap ticket
const renderCheapDay = (cheapTicket) => {
	cheapestTicket.style.display = 'block';
	cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
	const ticket = createCard(cheapTicket[0]);
	cheapestTicket.append(ticket);
};

// renderCheap tickets
const renderCheapYear = (cheapTickets) => {
	otherCheapTickets.style.display = 'block';
	otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
	// sort by name
	cheapTickets.sort((a, b) => {
		if (a.value < b.value) {
			return -1;
		}
		if (a.value > b.value) {
			return 1;
		}
		// names must be equal
		return 0;
	});

	cheapTickets.forEach((item) => {
		const ticket = createCard(item);
		otherCheapTickets.append(ticket);
	})

	// const tickets = 

};

// renderCheap ticket on choisen data
const renderCheap = (data, date) => {
	const cheapTicketYear = JSON.parse(data).best_prices;
	const cheapTicketDay = cheapTicketYear.filter((item) => item.depart_date === date);

	renderCheapDay(cheapTicketDay);
	renderCheapYear(cheapTicketYear);
};


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

formSearch.addEventListener('submit', (event) => {
	event.preventDefault();

	const formData = {
		from: city.find((item) => inputCitiesFrom.value === item.name),
		to: city.find((item) => inputCitiesTo.value === item.name),
		when: inputDateDepart.value,
	}

	if (formData.from && formData.to) {
		const requestData = `?currency=usd&depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;
		getData(CALENDAR + requestData, (response) => {
			renderCheap(response, formData.when);
		});
	} else {
		alert('Введите корректное название города!')
	}

	// const requestData2 = '?depart_date=' + formData.when +
	// 	'&origin=' + formData.from +
	// 	'&destination=' + formData.to +
	// 	'&one_way=true&token=' + API_KEY;

})

// functions calls
getData(CITIES_API, (data) => {
	city = JSON.parse(data).filter(item => item.name);
	city.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		// names must be equal
		return 0;
	});
});
