const $ = (el) => document.querySelector(el); //para seleccionar un elemento
const $$ = (el) => document.querySelectorAll(el); //para seleccionar varios elementos

const $table = $('table');
const $head = $('thead');
const $body = $('tbody');

const ROWS = 10; //número de filas
const COLUMNS = 3; //número de columnas
const FIRST_CHAR_CODE = 65; //código ASCII de la letra 'A'

const range = (length) => Array.from({ length }, (_, i) => i); //crea un array de longitud 'length' con índices del 0 al length-1
const getColumn = (i) => String.fromCharCode(FIRST_CHAR_CODE + i); //convierte un índice a su correspondiente letra de columna (A, B, C, ...)

let STATE = range(COLUMNS).map((i) =>
  range(ROWS).map((j) => ({ computedValue: j, value: j }))
); //inicializa el estado de la hoja de cálculo como un array de objetos con valores por defecto...es un array bidimensional donde cada celda tiene un objeto con 'computedValue' y 'value'.

const renderSpreadSheet = () => {
  // Renderiza la hoja de cálculo en el DOM
  const headerHTML = `<tr>
        <th></th> 
        ${range(COLUMNS)
          .map((i) => `<th>${getColumn(i)}</th>`)
          .join('')}
    </tr>`;

  $head.innerHTML = headerHTML;

  const bodyHTML = range(ROWS)
    .map((row) => {
      return `<tr>
        <td>${row + 1}</td>
        ${range(COLUMNS)
          .map(
            (column) => `
          <td data-x="${column}" data-y="${row}">
            <span>${STATE[column][row].computedValue}</span>
            <input type="text" value="${STATE[column][row].value}"/>
          </td>
          `
          )
          .join('')}  
    </tr>`;
    })
    .join('');

  $body.innerHTML = bodyHTML;
};

$body.addEventListener('click', (event) => {
  const td = event.target.closest('td'); //busca el elemento td más cercano al evento
  if (!td) return; //si no hay td, sale de la función

  const { x, y } = td.dataset; //obtiene las coordenadas de la celda desde los atributos data-x y data-y
  const input = td.querySelector('input'); //selecciona el input dentro del td
  const span = td.querySelector('span'); //selecciona el span dentro del td

  input.focus(); //enfoca el input
});

renderSpreadSheet(); // Inicializa la hoja de cálculo
