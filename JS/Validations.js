const isValid = (element)=>{
    const container = element.parentElement;
    container.classList.add("is-valid");
    container.classList.remove("is-invalid");
}

const isInvalid = (element)=>{
    const container = element.parentElement;
    container.classList.add("is-invalid");
    container.classList.remove("is-valid");
}

// Validar nombres
const validateName = (event) => {
    const input = event.target;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}( [A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})*$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}
// Validar apellidos
const validateLastName = (event) => {
    const input = event.target;
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]{1,} {0,1})+$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

// Validar correo
const validateEmail = (event) => {
    const input = event.target;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

// Validar teléfonos (10 dígitos México)
const validatePhone = (event) => {
    const input = event.target;
    const regex = /^[0-9]{10}$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

// Validar código postal (5 dígitos México)
const validateCP = (event) => {
    const input = event.target;
    const regex = /^[0-9]{5}$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

// Validar país, estado y ciudad (letras y espacios)
const validateText = (event) => {
    const input = event.target;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

const validateDate = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // eliminar todo lo que no sea número

    // Insertar slashes automáticamente
    if (value.length > 2 && value.length <= 4) {
        value = value.slice(0,2) + '/' + value.slice(2);
    } else if (value.length > 4) {
        value = value.slice(0,2) + '/' + value.slice(2,4) + '/' + value.slice(4,8);
    }
    input.value = value;

    // Validar formato dd/mm/yyyy
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    regex.test(input.value) ? isValid(input) : isInvalid(input);
}

// Validar select de género
const validateSelect = (event) => {
    const input = event.target;
    input.value ? isValid(input) : isInvalid(input);
}

// Validar cantidad (solo número y mayor a 100)
const validateAmount = (event) => {
    const input = event.target;
    const value = parseFloat(input.value);
    if (!isNaN(value) && value > 100) {
        isValid(input);
    } else {
        isInvalid(input);
    }
}

const cardIcons = {
    amex: "fa-brands fa-cc-amex",
    visa: "fa-brands fa-cc-visa right-icon",
    mastercard: "fa-brands fa-cc-mastercard right-icon",
    discover: "fa-solid fa-credit-card right-icon",
    jcb: "fa-solid fa-credit-card right-icon",
    unknown: "fa-solid fa-credit-carright-icond"
};

// Luhn check
const luhnCheck = (num) => {
    let sum = 0;
    let shouldDouble = false;
    for(let i=num.length-1;i>=0;i--){
        let digit = parseInt(num[i]);
        if(shouldDouble){
            digit *= 2;
            if(digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

// Detectar franquicia
const detectCardType = (num) => {
    if(/^3[47]/.test(num)) return 'amex';
    else if(/^4/.test(num)) return 'visa';
    else if(/^5[1-5]/.test(num)) return 'mastercard';
    else if(/^6011|^65|^64[4-9]/.test(num)) return 'discover';
    else if(/^35/.test(num)) return 'jcb';
    else return 'unknown';
}

// Validar y formatear tarjeta con icono
const validateCard = (event) => {
    const input = event.target;
    const icon = document.getElementById("card-icon"); // icono derecho
    let cursorPos = input.selectionStart;

// Solo números
    let value = input.value.replace(/\D/g,'');

// Detectar tipo
    let type = detectCardType(value);
    input.dataset.cardType = type;

// Limitar longitud según tipo
    let maxLength = type === 'amex' ? 15 : 16;
    value = value.slice(0, maxLength);

// Formatear con guiones
    let formatted = '';
    if(type === 'amex'){ // 4-6-5
        for(let i=0;i<value.length;i++){
            if(i===4 || i===10) formatted += '-';
            formatted += value[i];
        }
    } else { // 4-4-4-4
        for(let i=0;i<value.length;i++){
            if(i>0 && i%4===0) formatted += '-';
            formatted += value[i];
        }
    }

// Ajustar valor y cursor
    let diff = formatted.length - input.value.length;
    input.value = formatted;
    cursorPos += diff;
    input.setSelectionRange(cursorPos, cursorPos);

// Validación Luhn
    const isValidCard = value.length >= 12 && luhnCheck(value);
    isValidCard ? isValid(input) : isInvalid(input);

// Actualizar icono derecho SIN afectar el izquierdo
    icon.className = `right-icon ${cardIcons[type] || 'fa-solid fa-credit-card'}`;

}



// Validar banco (nombre, letras y espacios)
const validateBank = (event) => {
    const input = event.target;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    regex.test(input.value.trim()) ? isValid(input) : isInvalid(input);
}

const validateExpiry = (event) => {
    const input = event.target;
    let cursorPos = input.selectionStart;

    // quitar todo lo que no sea número
    let value = input.value.replace(/\D/g, '');

    // Formatear con "/"
    if(value.length > 2){
        value = value.slice(0,2) + '/' + value.slice(2,4);
    }

    // Ajustar el cursor para no saltar
    let diff = value.length - input.value.length;
    input.value = value;
    cursorPos += diff;
    if(cursorPos > value.length) cursorPos = value.length;
    input.setSelectionRange(cursorPos, cursorPos);

    // Validación MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if(regex.test(value)){
        // Separar mes y año
        const [monthStr, yearStr] = value.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt('20' + yearStr, 10); // convertir YY a 20YY

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 0-11
        const currentYear = now.getFullYear();

        // Validar que sea mayor que la fecha actual
        if(year > currentYear || (year === currentYear && month >= currentMonth)){
            isValid(input);
        } else {
            isInvalid(input);
        }
    } else {
        isInvalid(input);
    }
}

const checkContinue = (evt) => {
    const container = evt.target.parentElement.parentElement
    const elements = container.querySelectorAll(".form-group")
    var pass = true


    elements.forEach((elem) => {
        if (elem.classList.contains("is-invalid") || !elem.classList.contains("is-valid")) {
            pass = false;
        }
    })

    if (!pass) {
        container.parentElement.querySelector("button").classList.add("disabled")
        container.parentElement.querySelector("button").setAttribute("disabled", "disabled");
    }else{
        container.parentElement.querySelector("button").classList.remove("disabled")
        container.parentElement.querySelector("button").removeAttribute("disabled");
    }
}

// Asignar eventos
document.getElementById("nombre").addEventListener("input", validateName);
document.getElementById("last_name_1").addEventListener("input", validateLastName);
document.getElementById("last_name_2").addEventListener("input", validateLastName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("phone_1").addEventListener("input", validatePhone);
document.getElementById("phone_2").addEventListener("input", validatePhone);
document.getElementById("cp").addEventListener("input", validateCP);
document.getElementById("país").addEventListener("input", validateText);
document.getElementById("estado").addEventListener("input", validateText);
document.getElementById("ciudad").addEventListener("input", validateText);
document.getElementById("fecha_nacimiento").addEventListener("input", validateDate);
document.querySelector(".form-group.select select").addEventListener("change", validateSelect);

document.getElementById("amount").addEventListener("input", validateAmount);
document.getElementById("periodicidad").addEventListener("change", validateSelect);
document.getElementById("metodo_corbro").addEventListener("change", validateSelect);
document.getElementById("requiere_factura").addEventListener("change", validateSelect);
document.getElementById("tarjeta").addEventListener("input", validateCard);
document.getElementById("Banco").addEventListener("input", validateBank);
document.getElementById("fecha_vencimiento").addEventListener("input", validateExpiry);

document.getElementById("nombre").addEventListener("input",                         checkContinue);
document.getElementById("last_name_1").addEventListener("input",                    checkContinue);
document.getElementById("last_name_2").addEventListener("input",                    checkContinue);
document.getElementById("email").addEventListener("input",                          checkContinue);
document.getElementById("phone_1").addEventListener("input",                        checkContinue);
document.getElementById("phone_2").addEventListener("input",                        checkContinue);
document.getElementById("cp").addEventListener("input",                             checkContinue);
document.getElementById("país").addEventListener("input",                           checkContinue);
document.getElementById("estado").addEventListener("input",                         checkContinue);
document.getElementById("ciudad").addEventListener("input",                         checkContinue);
document.getElementById("fecha_nacimiento").addEventListener("input",               checkContinue);
document.querySelector(".form-group.select select").addEventListener("change",      checkContinue);
document.getElementById("amount").addEventListener("input",                         checkContinue);
document.getElementById("periodicidad").addEventListener("change",                  checkContinue);
document.getElementById("metodo_corbro").addEventListener("change",                 checkContinue);
document.getElementById("requiere_factura").addEventListener("change",              checkContinue);
document.getElementById("tarjeta").addEventListener("input",                        checkContinue);
document.getElementById("Banco").addEventListener("input",                          checkContinue);
document.getElementById("fecha_vencimiento").addEventListener("input",              checkContinue);
document.getElementById("confirmacion").addEventListener("input",checkContinue);
document.getElementById("confirmacion").addEventListener("input",event=>{
    event.target.value.length >3 ? isValid(event.target): isInvalid(event.target)
});

