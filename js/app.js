//Variables
const campoYear = document.querySelector("#year");
const formulario = document.querySelector("#cotizar-seguro");
const resultado = document.querySelector("#resultado");
const spinner = document.querySelector("#cargando");


//Eventos
cargarEventos();
function cargarEventos() {

    formulario.addEventListener("submit", validarForm)
}


//Objetos/Contructores
const Seguro = function (marca, year, tipoSeguro) {
    this.marca = marca;
    this.year = year;
    this.tipoSeguro = tipoSeguro
}


const UI = function () { }

//Funciones/Protos
UI.prototype.mostrarYears = function () {
    const maxYear = new Date().getFullYear();
    const minYear = maxYear - 10;
    for (let i = maxYear; i > minYear; i--) {
        const optionYear = document.createElement("option");
        optionYear.value = i;
        optionYear.textContent = i;

        campoYear.appendChild(optionYear)
    }


}

UI.prototype.mostrarMensaje = function (mensaje, tipoMensaje) {
    const mensajeHTML = document.createElement("P");
    mensajeHTML.textContent = mensaje;
    mensajeHTML.classList.add("mt-5")

    if (tipoMensaje == "error") {
        mensajeHTML.classList.add("error")
    } else {
        mensajeHTML.classList.add("correcto")
    }

    const errores = document.querySelectorAll(".error");
    const correctos = document.querySelectorAll(".correcto");

    if (errores.length == 0 && correctos.length == 0) {
        formulario.insertBefore(mensajeHTML, resultado);
    }

    setTimeout(() => {
        mensajeHTML.remove();
    }, 3000);


}

Seguro.prototype.cotizarSeguro = function () {
    /*
    1. Americano = 1.15%
    2. Asiatico = 1.05%
    3. Europeo = 1.35%

    */

    const base = 2000
    let resultado = 0;

    switch (this.marca) {
        case "1":
            resultado += base * 1.15;
            break;

        case "2":
            resultado += base * 1.05;
            break;

        case "3":
            resultado += base * 1.35;
            break;

        default:
            break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //A mas antiguo el carro se reduce cada año un 3%
    resultado -= ((diferencia * 3) * resultado) / 100;

    /*
    Si el seguro es basico se multiplica por 30% mas
    Si el seguro es premium se multiplica por 50% mas

    */

    if (this.tipoSeguro == "basico") {
        resultado *= 1.30;
    } else {
        resultado *= 1.50;
    }

    return resultado;
}

UI.prototype.mostrarResultado = function (total, seguro) {
    const resultadoHTML = document.createElement("div");
    resultadoHTML.classList.add("mt-5")


    let textoMarca;

    if (seguro.marca == "1") {
        textoMarca = "Americano"
    } else if (seguro.marca == "2") {
        textoMarca = "Asiatico"
    } else {
        textoMarca = "Europeo";
    }

    resultadoHTML.innerHTML = `
    <p class="header"> Tu resumen </p>
    <p class="font-bold"> Marca: <span class="font-normal">${textoMarca} </span> </p>
    <p class="font-bold"> Año: <span class="font-normal">${seguro.year} </span> </p>
    <p class="font-bold"> Tipo de seguro: <span class="font-normal">${seguro.tipoSeguro} </span> </p>

    <p class="font-bold"> Total: <span class="font-normal">$${total} </span> </p>
    `;

    setTimeout(() => {
        resultado.appendChild(resultadoHTML);
    }, 3000);

}




const ui = new UI();
ui.mostrarYears();



//Funciones
function validarForm(e) {
    e.preventDefault();

    const campoMarca = document.querySelector("#marca").value;
    const campoYear = document.querySelector("#year").value;
    const campoTipo = document.querySelector("input[name=tipo]:checked").value;

    if (campoMarca == "" || campoYear == "" || campoTipo == "") {
        console.log("vacio")
        ui.mostrarMensaje("Todos los campos son obligatorios", "error")
    } else {
        limpiarHTML();
        ui.mostrarMensaje("Cotizando seguro...", "correcto");
        spinner.style.display = "block"

        setTimeout(() => {
            spinner.style.display = "none"
        }, 3000);

        const seguro = new Seguro(campoMarca, campoYear, campoTipo);
        seguro.cotizarSeguro();
        const total = seguro.cotizarSeguro();

        ui.mostrarResultado(total, seguro);
    }

}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
