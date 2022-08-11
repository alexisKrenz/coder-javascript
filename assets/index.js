const products = [{
  id: 0,
  nombre: "Baileys",
  precio: 6500,
  imgSrc: "./assets/img/baileys.png",
},
{
  id: 1,
  nombre: "Cerveza",
  precio: 200,
  imgSrc: "./assets/img/duff.jpg",
},
{
  id: 2,
  nombre: "Vino Blanco",
  precio: 250,
  imgSrc: "./assets/img/blanco.png",
},
{
  id: 3,
  nombre: "Vino Tinto",
  precio: 250,
  imgSrc: "./assets/img/tinto.png",
},
{
  id: 4,
  nombre: "Whisky Jack Daniels",
  precio: 8000,
  imgSrc: "./assets/img/wisky.png",
},
{
  id: 5,
  nombre: "Johnnie Walker R Label",
  precio: 4000,
  imgSrc: "./assets/img/rlabel.png",
},
{
  id: 6,
  nombre: "Licor Tia Maria",
  precio: 1500,
  imgSrc: "./assets/img/tmaria.png",
},
{
  id: 7,
  nombre: "Absenta",
  precio: 12000,
  imgSrc: "./assets/img/absent.png",
},
{
  id: 8,
  nombre: "Vodka Absolut",
  precio: 4000,
  imgSrc: "./assets/img/absolut.png",
},
{
  id: 9,
  nombre: "Vodka Smirnoff",
  precio: 4000,
  imgSrc: "./assets/img/smirnof.png",
},
{
  id: 10,
  nombre: "Whisky Chivas",
  precio: 7500,
  imgSrc: "./assets/img/chivas.png",
},
{
  id: 11,
  nombre: "Licor Sheridans",
  precio: 9000,
  imgSrc: "./assets/img/sheridan.png",
},
];


setTimeout(preguntarEdad, 2000);
//funcion que pregunta si es mayor de edad al abrir la pagina, si lo es permite comprar, sino redirige a google.com//
function preguntarEdad() {
  Swal.fire({
    title: 'Alto!',
    text: "Debes ser mayor de 18 para poder comprar aqui",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: "Salir",
    confirmButtonText: 'Soy mayor de edad'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Bienvenido',
        'Disfruta tu compra.',
        'success'
      ) 
    } else {location.href="http://www.google.com";}
  })
}

const productsEl = document.querySelector('.products');
const cartItemsEl = document.querySelector('.cart-items');
const subTotalEl = document.querySelector('.subTotal');
const removeButton = document.querySelectorAll('.removeButton')
const darkModeButton = document.getElementById('switch');
const mostSold = document.querySelector('.mostSold')
const contadorDeItems = document.querySelector('.contador-carrito')


let carrito = JSON.parse(localStorage.getItem('CART')) || []; // si no hay nada en localStorage le da como valor un array vacio
updateCart();

function renderProd() {
  products.forEach((product) => {
    productsEl.innerHTML += `
    <div class="item">
    <div class="item-container" class="item-flex">
        <div>
            <img src="${product.imgSrc}" alt="">
        </div>
        <div class="description">
            <div class="prodname">
                <h4>${product.nombre}</h4>
            </div>
            <div class="data">
                <h4> $ ${product.precio}</h4>
            
                <p class="add-to-cart" onclick="addToCart(${product.id})">Agregar al carrito</p>
            </div>
        </div>
    </div>
</div>

    `
  }) // al hacer click llama a addToCart y le pasa el parametro id de product
}
renderProd();

function addToCart(id) { // guarda el objeto especifico en array / viene del onclick del <p> que llama a la funcion y pasa el id como parametro. addToCart(id) representa al addToCart${product.id}

  if (carrito.some((item) => item.id === id)) {
    callToast() // muestra mensaje utilizando toastify
  } else {
    const item = products.find((product) => product.id === id); // busca en el array el objeto (producto) que cumple con la condicion de tener un id = al del onclick y lo retorna
    carrito.push({
      ...item,
      cantidad: 1, // se utiliza spread para agregar una propiedad y valor nuevos 
    })
  }
  updateCart()
};

function updateCart() {
  renderCartItems();
  renderSubTotal();
  localStorage.setItem('CART', JSON.stringify(carrito)); // cada vez que se actualiza el carrito manda al CART el carrito con su contenido actual
}

function renderCartItems() {
  cartItemsEl.innerHTML = ""; // esto evita la repeticion de productos 
  carrito.forEach((item) => {
    cartItemsEl.innerHTML += `
    <div class="cart-item"> 
            <div class="info">
            <div class="item-img"  src="${item.imgSrc}" alt="${item.nombre}"></div>
            <h4>${item.nombre}</h4>  
        </div>
        <div class="price">
            <h4> $ ${item.precio}</h2>
        </div>
        <div class="cantidad">
            <div class="btnm" onclick="selectUnits('restar', ${item.id})">-</div>
            <p>${item.cantidad}</p>
            <div class="btnm" onclick="selectUnits('sumar', ${item.id})">+</div>
        </div>
        <div>
            <input type="button" class="removeButton" onclick="removeFromCart(${item.id})" value="X">
        </div>
    </div>  
    `
  })
};

function selectUnits(acc, id) {
  carrito = carrito.map((item) => {
    let unidadesEnCarrito = item.cantidad
    if (item.id === id) {
      if (acc === 'restar' && unidadesEnCarrito > 1) { // incrementa las unidades solo si es mayor a 1, evitando los numeros negativos
        unidadesEnCarrito--
      } else if (acc === 'sumar') {
        unidadesEnCarrito++
      }
    };
    return {
      ...item, // devuelve el objeto y lo desestructura nuevamente agregandole el nuevo valor
      cantidad: unidadesEnCarrito,

    };
  })
  updateCart(); // actualiza el carrito 
};


function renderSubTotal() {
  let precioTotal = 0;
  let totalDeItems = 0;
  carrito.forEach((item) => {
    precioTotal += item.precio * item.cantidad;
    totalDeItems += item.cantidad;
  })
  subTotalEl.innerHTML = ''; // lo actualiza a 0 para no repetir y vuelve a escribir el resultado
  subTotalEl.innerHTML += `
  Subtotal: $${precioTotal}
  <input type="button" value="Comprar!" onclick="buy()">
  `
  contadorDeItems.innerHTML = `<p>${totalDeItems}</p>`
};


function removeFromCart(id) { // un parametro para saber a quien remover
  carrito = carrito.filter((item) => item.id !== id) // reemplaza el array de cart con uno nuevo si es que el id pasado como parametro es distinto
  updateCart();
};


function buy() {
  cartItemsEl.innerHTML = ``;
  subTotalEl.innerHTML = `<p>Subtotal: $</p>`;
  Swal.fire({ // sweetalert para mostrar mensaje de confirmacion 
    position: 'center',
    icon: 'success',
    title: 'Gracias por tu compra!',
    showConfirmButton: false,
    timer: 1500
  })
  carrito = [];
  contador = [];
  updateCart();
};


// utilizacion de fetch para obtener datos sobre otros productos y generar nueva seccion
fetch("./assets/products.json")
  .then((resp) => resp.json())
  .then((productos) => {
    productos.forEach((prod) => {
      mostSold.innerHTML += `
                              <div class="mostSoldItem">
                              <div class="mostSoldImg">
                              <img src="./assets/img/fernet.png" alt="">
                              </div>
                              <h4>${prod.nombre}</h4>
                              <p>$${prod.precio}</p>
                              <div class="mostSoldLink">
                              <a href="#">Ver!</a>
                              </div>
                              </div>
                              `
    })
  });


// dark mode //
darkModeButton.addEventListener('click', turnToDark);

function turnToDark() {
  document.body.classList.toggle('dark');

  document.body.classList.contains('dark') ? localStorage.setItem('darkMode', 'true') : (localStorage.setItem('darkMode', 'false'));
};
if (localStorage.getItem('darkMode') === 'true') { // si quedo grabado en storage
  document.body.classList.add('dark')
};

// llama a toastify //
function callToast() {
  Toastify({
    text: "Ya esta en el carrito",
    duration: 3000,
    destination: "",
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #ff0000, #d84f00)",
    },
    onClick: function () { }
  }).showToast();
};