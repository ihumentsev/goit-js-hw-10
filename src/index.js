import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
//////////////////
const DEBOUNCE_DELAY = 300;
//////////////////
const refs = {
  inputEl: document.getElementById('search-box'),
  listEl: document.querySelector('.country-list'),
  cardEl: document.querySelector('.country-info'),
};
/////////////////
refs.inputEl.addEventListener('input', debounce(onSerchInput, DEBOUNCE_DELAY));

function onSerchInput() {
  if (refs.inputEl.value === '') {
    refs.cardEl.innerHTML = '';
    refs.listEl.innerHTML = '';
    return;
  }

  fetchCountries(refs.inputEl.value)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.cardEl.innerHTML = '';
        refs.listEl.innerHTML = '';
        return;
      }

      if (countrys.length <= 10) {
        refs.listEl.innerHTML = countrys
          .map(country => {
            return `
  <li class="country-list__item">
    <img class="country-list__flags" src="${country.flags.svg}" alt="${country.name.official}" width="50" />
    <h2 class="country-list__name">${country.name.official}</h2>
  </li>
  `;
          })
          .join('');
        refs.cardEl.innerHTML = '';
      }

      if (countrys.length === 1) {
        refs.cardEl.innerHTML = countrys
          .map(country => {
            console.log(country);
            return `
    <div class="country-info__container">
      <div class="country-info__wrapper">
        <img class="country-info__flags" src="${country.flags.svg}" alt="${
              country.name.official
            }" width="100" />
        <h2 class="country-info__name">${country.name.official}</h2>
      </div>
      <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${
        country.capital
      }</p>
      <p class="country-info__population"><span class="country-info__weight">Population:</span> ${
        country.population
      }</p>
      <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
        country.languages
      )}</p>
    </div>
  `;
          })
          .join('');
        refs.listEl.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.cardEl.innerHTML = '';
      refs.listEl.innerHTML = '';
      return error;
    });
}
