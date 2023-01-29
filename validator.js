

const Validator = (options) => {
  
  let selectorRules = {};

  //The function that performs Validate
  const validate = (inputElement, rule) => {
    let errorElement = inputElement.parentElement.querySelector('.form-msg');
    let errorMessage;
    
    let rules = selectorRules[rule.selector];

    for(let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if(errorMessage) {
      errorElement.innerText = errorMessage;
      invalid(inputElement);
    } else {
      errorElement.innerText = '';
      valid(inputElement);
    }

    return !errorMessage;
  }

  const formElement = document.querySelector(options.form);
  if(formElement) {

    formElement.onsubmit = (event) => {
      event.preventDefault();

      let isValidForm = true;

      options.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);

        if(!isValid) {
          isValidForm = false;
        }
      });

      //Handling onsubmit with Js
      if(isValidForm) {
        if(typeof options.onSubmit === 'function') {
          let enableInputs = formElement.querySelectorAll('[name]:not([id*="confirmation"])');
          enableInputs = [...enableInputs];
          let formValue = enableInputs.reduce((formValue, input) => {
            formValue[input.id] = input.value;
            return formValue;
          }, {});
          options.onSubmit(formValue);
          alert('Success!');
        }
      }
    }

    // Loop qua từng rule và handle
    options.rules.forEach((rule) => {
      //  Lưu các rules của các selectors
      if(Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      // Xử lý(lắng nghe, hiện errorMessage)
      const inputElement = formElement.querySelector(rule.selector);
      let errorElement = inputElement.parentElement.querySelector('.form-msg');
      inputElement.oninput = () => {
        errorElement.innerText = '';
        valid(inputElement);
      }

      inputElement.onblur = () => {
        validate(inputElement, rule);
      } 
 
    });
  }
}


//Defining rules
Validator.isRequired = (selector, message = 'The field is required!') => {
  return {
    selector: selector,
    test: (value) => {
      return value.trim() ? undefined : message;
  }};
};

Validator.isEmail = (selector, message = 'Please enter a valid e-mail address!') => {
  return {
    selector: selector,
    test: (value) => {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message;
  }};
};

Validator.minLength = (selector, min, message = `Please enter the least ${min} characters!`) => {
  return {
    selector: selector,
    test: (value) => {
      return value.length >= min ? undefined : message; 
    }
  }
}

Validator.isConfirmed = (selector, getConfirmValue, message = 'Password is not matching!') => {
  return {
    selector: selector,
    test: (value) => {
      return value === getConfirmValue() ? undefined : message;
    }
  }
}

// Handle CSS
const invalid = (inputElement) => {
  inputElement.style['border-color'] = 'red';
  inputElement.parentElement.querySelector('.form-msg').style.color = 'red';
}

const valid = (inputElement) => {
  inputElement.style['border-color'] = '';
  inputElement.parentElement.querySelector('.form-msg').style.color = '';
}



// Handling show-hide password
function showHidePassword(passwordForm) {
  const inputForm = passwordForm.querySelector("[name]");
  const labelForm = passwordForm.querySelector("label");
  const eyeIcon = document.createElement("div");
  const topEye = labelForm.offsetHeight + inputForm.offsetHeight / 2;
  passwordForm.style.position = "relative";
  eyeIcon.innerHTML = `
    <span class="close" style=""><i class="fa-solid fa-eye-slash"></i></span>
    <span class="open" style="display: none;"><i class="fa-solid fa-eye"></i></span>
  `;
  eyeIcon.setAttribute(
    "style",
    `
    font-size: 1.4rem;
    position: absolute;
    right: .8rem;
    top: ${topEye}px;
    cursor: pointer;
  `
  );

  const eyeClose = eyeIcon.querySelector(".close");
  const eyeOpen = eyeIcon.querySelector(".open");
  eyeIcon.onclick = () => {
    if (inputForm.type === "password") {
      inputForm.type = "text";
      eyeClose.style.display = "none";
      eyeOpen.style.display = "block";
    } else {
      inputForm.type = "password";
      eyeOpen.style.display = "none";
      eyeClose.style.display = "block";
    }
  };

  passwordForm.appendChild(eyeIcon);
}


const passwordForm = document.querySelector('.password-form');
const passwordConfirmationForm = document.querySelector('.password-confirmation-form');
showHidePassword(passwordForm)
showHidePassword(passwordConfirmationForm);
