const $ = (el) => document.querySelector(el); //para seleccionar un elemento
const $$ = (el) => document.querySelectorAll(el); //para seleccionar varios elementos

const ROWS = 10; //número de filas
const COLUMNS = 3; //número de columnas

const range = (length) => Array.from({ length }, (_, i) => i); //crea un array de longitud 'length' con índices del 0 al length-1

const renderSpreadSheet = () => {
  const $table = $('table');
  const $head = $('thead');
  const $body = $('tbody');

  const headerHTML = `<tr>
        <th></th> 
        ${range(COLUMNS)
          .map((i) => `<th>${i}</th>`)
          .join('')}
    </tr>`;

  $head.innerHTML = headerHTML;

  const bodyHTML = `<tr>
    </tr>`;

  $body.innerHTML = bodyHTML;
};

renderSpreadSheet(); // Inicializa la hoja de cálculo
