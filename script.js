const formSearch = document.querySelector('.form-search'),
	inputCitiesFrom = document.querySelector('.input__cities-from'),
	dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
	inputCitiesTo = document.querySelector('.input__cities-to'),
	dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
	inputDateDepart = document.querySelector('.input__date-depart');

const city = ["Київ", "Львів", "Дніпро", "Ізяслав", "Кременчук", "Бат-Ям", "Тель-Авів", "Єрусалим", "Хмельницький", "Одеса"];

const showCity = (input, list) => {
	const filterCity = city.filter((item) => {
		list.innerHTML = '';
		if (input.value !== '') {
			return item.toLowerCase().includes(input.value.toLowerCase());
		}
		return false;
	})

	filterCity.forEach((item) => {
		const li = document.createElement('li');
		li.classList.add('dropdown__city');
		li.textContent = item;
		list.append(li);
	})
};

function markCity(event, field, parent) {
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
	markCity(e, inputCitiesFrom, dropdownCitiesFrom);
});

// list cities to
inputCitiesTo.addEventListener('input', () => {
	showCity(inputCitiesTo, dropdownCitiesTo);
});
dropdownCitiesTo.addEventListener('click', (e) => {
	markCity(e, inputCitiesTo, dropdownCitiesTo);
});

