import data from './data.js';
import './style.scss';
import 'bootstrap';

const root = document.getElementById('app');

data.forEach((element) => {
  const item = document.createElement('div');
  item.textContent = element;
  item.classList.add('item');

  root.appendChild(item);
});
