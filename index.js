// Obtener referencia al elemento de la tabla en HTML
const tableBody = document.getElementById('table-body');
let peticiones = 10;
let url = 'https://rickandmortyapi.com/api/character/?page=';


//realiza un arreglo de randoms
  const arr = [];
  while (arr.length < peticiones) {
    const randomNum = Math.floor(Math.random() * 20)+1;
    if (!arr.includes(randomNum)) {
      arr.push(randomNum);
    }
  }
  
  console.log(arr);


//segundo personaje
function buscarPersonaje(row, urlActual, nombre, primeraImagen,genero) {
  fetch(urlActual)
    .then(response => response.json())
    .then(data => {
      // Buscar el personaje por nombre en los resultados de la página actual
      const personajeEncontrado = data.results.find(character => {
        const characterNameParts = character.name.split(" ");
        const imagenDiferente = character.image !== primeraImagen;
        const mismoGenero = character.gender.toLowerCase() === genero.toLowerCase()||character.gender.toLowerCase()  ===  'unknown';
      return (characterNameParts.includes(nombre[0]) || characterNameParts.includes(nombre[1])) && imagenDiferente && mismoGenero;
    });

      // Si se encuentra el personaje, agregar su imagen a la fila actual
      if (personajeEncontrado) {
        const image2Cell = document.createElement('td');
        const image2 = document.createElement('img');
        image2.src = personajeEncontrado.image;
        image2.alt = personajeEncontrado.name;
        image2Cell.appendChild(image2);
        row.appendChild(image2Cell);
      } else {
        // Si el personaje no se encuentra en la página actual, buscar en la siguiente página (si hay más)
        const nextPageUrl = data.info.next;
        if (nextPageUrl) {
          buscarPersonaje(row, nextPageUrl, nombre, primeraImagen,genero);
        } else {
          // Si no se encuentra el personaje, agregar una celda vacía y mostrar un mensaje de error
          const emptyCell = document.createElement('td');
          emptyCell.textContent = '';
          row.appendChild(emptyCell);
          // Si no hay más páginas y no se encontró el personaje, mostrar un mensaje de error
          console.log(`No se encontró ningún personaje con el nombre "${nombre.join(" ")}"`);
        }
      }
    })
    .catch(error => console.log(error));
}

// Realizar la solicitud a la API de Rick and Morty
for(let i = 0; i < peticiones; i++){  
    const randPage = url + Math.floor(Math.random() * 42);
    fetch(randPage)   //elige un personaje por pagina
  .then(response => response.json())
  .then(data => {
    // Generar un índice aleatorio entre 0 y la longitud de la lista de personajes
    const randomIndex =arr[i];

    // Obtener el personaje seleccionado al azar
    const character = data.results[randomIndex];
    console.log(character);
    // Crear una nueva fila en la tabla
    const row = document.createElement('tr');

    // Crear una celda para el nombre del personaje
    const nameCell = document.createElement('td');
    nameCell.textContent = character.name;
    row.appendChild(nameCell);

    // Crear una celda para las características del personaje
    const statusCell = document.createElement('td');
    statusCell.textContent = `${character.status} - ${character.species}`;
    row.appendChild(statusCell);

    // Crear una celda para la primera imagen del personaje
    const image1Cell = document.createElement('td');
    const image1 = document.createElement('img');
    image1.src = character.image;
    image1.alt = character.name;
    image1Cell.appendChild(image1);
    row.appendChild(image1Cell);

    //crear una celda para la segunda imagen del personaje
    // Obtener la primera parte del nombre hasta el primer espacio
    const nameParts = character.name.split(" ");
    const firstName = nameParts[0]; // Obtener el primer nombre
    const lastName = nameParts.slice(1).join(" "); // Obtener el resto del nombre
    buscarPersonaje(row, url+5, [firstName, lastName], image1.src, character.gender);


    // Agregar la fila a la tabla
    tableBody.appendChild(row);
    console.log(i+1 );
  })
  .catch(error => console.log(error));
  console.log(i+1);
}

