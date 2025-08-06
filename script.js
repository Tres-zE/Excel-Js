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
  range(ROWS).map((j) => ({ computedValue: 0, value: 0 }))
); //inicializa el estado de la hoja de cálculo como un array de objetos con valores por defecto...es un array bidimensional donde cada celda tiene un objeto con 'computedValue' y 'value'.

function updateCell({ x, y, value }) {
  const newState = structuredClone(STATE); //clona el estado actual para no mutarlo directamente

  const cell = newState[x][y]; //obtiene la celda específica que se va a actualizar

  cell.computedValue = computeValue(value); //actualiza el valor computado de la celda -> span
  cell.value = value; //actualiza el valor de la celda -> input

  newState[x][y] = cell; //asigna el objeto actualizado a la celda correspondiente en el nuevo estado
  STATE = newState; //actualiza el estado global con el nuevo estado
  renderSpreadSheet(); //vuelve a renderizar la hoja de cálculo para reflejar los cambios
}

function computeValue(value) {
  if (!value.startsWith('=')) return value; //si el valor no empieza con '=', devuelve el valor original

  const formula = value.slice(1); //elimina el '=' del inicio del valor

  let computedValue;
  try {
    computedValue = eval(formula); //evalúa la expresión matemática contenida en la fórmula
  } catch (e) {
    console.error('Error al evaluar la fórmula:', e);
    computedValue = `!Error: ${e.message}`; //si hay un error al evaluar, devuelve 'Error'
  }
  return computedValue; //devuelve el valor computado
}

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

  const end = input.value.length; //obtiene la longitud del valor del input
  input.setSelectionRange(end, end); //establece el rango de selección del input para que el cursor esté al final del texto
  input.focus(); //enfoca el input

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') input.blur(); //si se presiona Enter, se pierde el foco del input
    if (event.key === 'Escape') input.value = STATE[x][y].value; //si se presiona Escape, se restablece el valor del input al valor original de la celda
  });

  input.addEventListener('blur', () => {
    console.log({ value: input.value, state: STATE[x][y].value });
    if (input.value === STATE[x][y].value) return; //si el valor del input es igual al valor actual de la celda, no hace nada
    updateCell({ x, y, value: input.value }); //actualiza la celda con el nuevo valor
  }),
    { once: true }; //el evento blur se ejecuta una sola vez
});

renderSpreadSheet(); // Inicializa la hoja de cálculo
