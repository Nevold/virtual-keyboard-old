import './style.scss';
import { keyLayoutEn, keyLayoutShiftUp, keyLayoutShiftDown } from './shared/english-layout';
import { keyLayoutRu } from './shared/russian-layout';

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    lang: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    // this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      // element.addEventListener('keypress', () => {
      //   this.open(element.value, (currentValue) => {
      //     element.value = currentValue;
      //   });
      // });
      this.open(element.value, (currentValue) => {
        element.value = currentValue;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = keyLayoutEn;

    // Creates HTML for an icon
    // const createIconHTML = (icon_name) => {
    //   return `<i class="material-icons">${icon_name}</i>`;
    // };

    // keyLayout = keyLayoutRu;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'delete', 'enter', '?'].indexOf(key) !== -1;

      // Add attributes/classes
      if (key.length > 1) {
        keyElement.dataset.name = key.toLocaleLowerCase();
      }
      if ((key.charCodeAt(0) >= 65 && key.charCodeAt(0) <= 90) || (key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122)) {
        keyElement.dataset.letter = key.toLocaleLowerCase();
      }
      // if (key.length === 1) {
      //   keyElement.classList.add('sign');
      // }
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      // keyElement.addEventListener('keydown', (e) => {
      //   // keyElement.classList.remove('keyboard__key--active');
      //   console.log(this);
      // });
      // keyElement.addEventListener('click', () => {
      //   let soundStart = document.querySelector('.sound');
      //   function isEmpty(soundStart) {
      //     for (let key in soundStart) {
      //       return false;
      //     }
      //     return true;
      //   }
      //   if (!isEmpty(soundStart)) {
      //     document.querySelector('audio').play();
      //   }
      // });

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide', 'func-keys');
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent('oninput');
          });
          break;

        case 'capslock':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'func-keys');
          keyElement.innerHTML = 'Caps';

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide', 'func-keys');
          keyElement.innerHTML = 'Enter';
          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide', 'func-keys');
          keyElement.innerHTML = '';

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });
          break;

        case 'arrowup':
          keyElement.classList.add('func-keys');
          keyElement.innerHTML = '&#9650;';
          keyElement.addEventListener('click', () => {
            this.properties.value += '▲';
            this._triggerEvent('oninput');
          });
          break;

        case 'arrowleft':
          keyElement.classList.add('func-keys');
          keyElement.innerHTML = '&#9668;';
          keyElement.addEventListener('click', () => {
            this.properties.value += '◄';
            this._triggerEvent('oninput');
          });
          break;

        case 'arrowdown':
          keyElement.classList.add('func-keys');
          keyElement.innerHTML = '&#9660;';
          keyElement.addEventListener('click', () => {
            this.properties.value += '▼';
            this._triggerEvent('oninput');
          });
          break;

        case 'arrowright':
          keyElement.classList.add('func-keys');
          keyElement.innerHTML = '&#9658;';
          keyElement.addEventListener('click', () => {
            this.properties.value += '►';
            this._triggerEvent('oninput');
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'func-keys');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            this.toggleCapsLockShift();
          });

          keyElement.addEventListener('mouseup', () => {
            this.toggleCapsLockShift();
          });
          break;

        case 'control':
          keyElement.classList.add('keyboard__key--bold', 'func-keys');
          keyElement.innerHTML = 'Ctrl';
          break;

        case 'alt':
          keyElement.classList.add('keyboard__key--bold', 'func-keys');
          keyElement.innerHTML = 'Alt';
          break;

        case 'meta':
          keyElement.classList.add('keyboard__key--bold', 'func-keys');
          keyElement.innerHTML = 'Win';
          break;

        case 'delete':
          keyElement.classList.add('keyboard__key--midlle-wide', 'func-keys');
          keyElement.innerHTML = 'Del';
          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--midlle-wide', 'func-keys');
          keyElement.innerHTML = 'Tab';

          keyElement.addEventListener('click', () => {
            this.properties.value += '    ';
            this._triggerEvent('oninput');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          // keyElement.addEventListener('keydown', (e) => {
          //   this.properties.value += this.properties.capsLock ? e.key.toUpperCase() : e.key.toLowerCase();
          //   keyElement.classList.add('keyboard__key--active');
          //   this._triggerEvent('oninput');
          // });

          // keyElement.addEventListener('keyup', () => {
          //   keyElement.classList.remove('keyboard__key--active');
          // });

          keyElement.addEventListener('click', () => {
            // this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.properties.value += keyElement.textContent;
            this._triggerEvent('oninput');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    window.addEventListener('keydown', (e) => {
      let key = '';
      let keySpace = '';
      let twiceKeys = [];
      let defaultKey = '';
      if (e.key.length > 1) {
        key = document.querySelector(`.keyboard__key[data-name=${String(e.key).toLowerCase()}]`);
        twiceKeys = [...document.querySelectorAll(`.keyboard__key[data-name=${String(e.key).toLowerCase()}]`)];
      } else {
        keySpace = document.querySelector('.keyboard__key--extra-wide');
      }

      switch (e.key.toLocaleLowerCase()) {
        case 'backspace':
          this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case 'capslock':
          this._toggleCapsLock();
          key.classList.toggle('keyboard__key--active', this.properties.capsLock);
          break;

        case 'enter':
          this.properties.value += '\n';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case ' ':
          this.properties.value += ' ';
          this._triggerEvent('oninput');
          keySpace.classList.add('keyboard__key--active');
          break;

        case 'arrowup':
          this.properties.value += '▲';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case 'arrowleft':
          this.properties.value += '◄';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case 'arrowdown':
          this.properties.value += '▼';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case 'arrowright':
          this.properties.value += '►';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        case 'shift':
          if (!e.repeat) {
            e.code === 'ShiftLeft' ? twiceKeys[0].classList.add('keyboard__key--active') : twiceKeys[1].classList.add('keyboard__key--active');
            this.toggleCapsLockShift();
          }
          break;

        case 'control':
          e.code === 'ControlLeft' ? twiceKeys[0].classList.add('keyboard__key--active') : twiceKeys[1].classList.add('keyboard__key--active');
          break;

        case 'alt':
          e.preventDefault();
          e.code === 'AltLeft' ? twiceKeys[0].classList.add('keyboard__key--active') : twiceKeys[1].classList.add('keyboard__key--active');
          break;

        case 'meta':
          key.classList.add('keyboard__key--active');
          break;

        case 'delete':
          key.classList.add('keyboard__key--active');
          break;

        case 'tab':
          e.preventDefault();
          this.properties.value += '    ';
          this._triggerEvent('oninput');
          key.classList.add('keyboard__key--active');
          break;

        default:
          if (this.properties.lang) {
            switch (e.code.toLocaleLowerCase()) {
              case 'bracketleft':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'х'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Х' : 'х';
                break;

              case 'bracketright':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ъ'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Ъ' : 'ъ';
                break;
              case 'semicolon':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ж'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Ж' : 'ж';
                break;
              case 'quote':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'э'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Э' : 'э';
                break;
              case 'comma':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'б'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Б' : 'б';
                break;
              case 'period':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ю'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Ю' : 'ю';
                break;
              case 'backquote':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ё'.charCodeAt(0))[0]
                  .classList.add('keyboard__key--active');
                this.properties.value += this.properties.capsLock ? 'Ё' : 'ё';
                break;
              default:
                break;
            }
          }
          if ((e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90) || (e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122)) {
            defaultKey = document.querySelector(`.keyboard__key[data-letter=${[...e.code.toLowerCase()].pop()}]`);
          } else {
            [defaultKey] = [...document.querySelectorAll('.keyboard__key')].filter((elem) => elem.textContent.toLowerCase() === e.key.toLowerCase());
          }

          if (defaultKey) {
            this.properties.value += defaultKey.textContent;
            defaultKey.classList.add('keyboard__key--active');
          }
          this._triggerEvent('oninput');
          break;
      }

      // const key = document.querySelector(`.keyboard__key[data-name=${String(e.key).toLowerCase()}]`);
      // this.properties.value += this.properties.capsLock ? e.key.toUpperCase() : e.key.toLowerCase();
      // key.classList.add('keyboard__key--active');
      // this._triggerEvent('oninput');
    });

    window.addEventListener('keyup', (e) => {
      let key = '';
      let keySpace = '';
      let twiceKeys = [];
      let defaultKey = '';
      if (e.key.length > 1) {
        key = document.querySelector(`.keyboard__key[data-name=${String(e.key).toLowerCase()}]`);
        twiceKeys = [...document.querySelectorAll(`.keyboard__key[data-name=${String(e.key).toLowerCase()}]`)];
      } else {
        keySpace = document.querySelector('.keyboard__key--extra-wide');
      }

      switch (e.key.toLocaleLowerCase()) {
        case 'backspace':
          key.classList.remove('keyboard__key--active');
          break;

        case 'enter':
          key.classList.remove('keyboard__key--active');
          break;

        case ' ':
          keySpace.classList.remove('keyboard__key--active');
          break;

        case 'arrowup':
          key.classList.remove('keyboard__key--active');
          break;

        case 'arrowleft':
          key.classList.remove('keyboard__key--active');
          break;

        case 'arrowdown':
          key.classList.remove('keyboard__key--active');
          break;

        case 'arrowright':
          key.classList.remove('keyboard__key--active');
          break;

        case 'shift':
          if (!e.repeat) {
            e.code === 'ShiftLeft' ? twiceKeys[0].classList.remove('keyboard__key--active') : twiceKeys[1].classList.remove('keyboard__key--active');
            this.toggleCapsLockShift();
          }
          break;

        case 'control':
          e.code === 'ControlLeft' ? twiceKeys[0].classList.remove('keyboard__key--active') : twiceKeys[1].classList.remove('keyboard__key--active');
          break;

        case 'alt':
          if (!e.repeat) {
            e.code === 'AltLeft' ? twiceKeys[0].classList.remove('keyboard__key--active') : twiceKeys[1].classList.remove('keyboard__key--active');
          }
          break;

        case 'meta':
          key.classList.remove('keyboard__key--active');
          break;

        case 'delete':
          key.classList.remove('keyboard__key--active');
          break;

        case 'tab':
          key.classList.remove('keyboard__key--active');
          break;

        default:
          // if (e.key.length === 1) {
          //   const key = [...document.querySelectorAll('.keyboard__key')].filter((elem) => elem.textContent.toLowerCase() === e.key.toLowerCase())[0];
          //   if (key) {
          //     key.classList.remove('keyboard__key--active');
          //   }
          // }
          if (this.properties.lang) {
            switch (e.code.toLocaleLowerCase()) {
              case 'bracketleft':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'х'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;

              case 'bracketright':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ъ'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              case 'semicolon':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ж'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              case 'quote':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'э'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              case 'comma':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'б'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              case 'period':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ю'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              case 'backquote':
                [...document.querySelectorAll('.keyboard__key')]
                  .filter((elem) => elem.textContent.toLowerCase().charCodeAt(0) === 'ё'.charCodeAt(0))[0]
                  .classList.remove('keyboard__key--active');
                break;
              default:
                break;
            }
          }
          if ((e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90) || (e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122)) {
            defaultKey = document.querySelector(`.keyboard__key[data-letter=${[...e.code.toLowerCase()].pop()}]`);
          } else {
            [defaultKey] = [...document.querySelectorAll('.keyboard__key')].filter((elem) => elem.textContent.toLowerCase() === e.key.toLowerCase());
          }

          if (defaultKey) {
            defaultKey.classList.remove('keyboard__key--active');
          }
          break;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey) {
        this.toggleLanguageLayout();
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    // console.log([...this.elements.keys].filter((elem) => !elem.classList.contains('func-keys')));
    // let count = 0;
    const elementWithoutFunc = [...this.elements.keys].filter((elem) => !elem.classList.contains('func-keys'));
    for (const key of elementWithoutFunc) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  toggleCapsLockShift() {
    this.properties.capsLock = !this.properties.capsLock;
    const elementWithoutFunc = [...this.elements.keys].filter((elem) => !elem.classList.contains('func-keys'));
    elementWithoutFunc.forEach((key, index) => {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? keyLayoutShiftUp[index] : keyLayoutShiftDown[index];
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    });
  },

  toggleLanguageLayout() {
    this.properties.lang = !this.properties.lang;
    const elementWithoutFunc = [...this.elements.keys].filter((elem) => !elem.classList.contains('func-keys'));
    elementWithoutFunc.forEach((key, index) => {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock) {
          key.textContent = this.properties.lang ? keyLayoutRu[index].toLocaleUpperCase() : keyLayoutShiftDown[index].toLocaleUpperCase();
        } else {
          key.textContent = this.properties.lang ? keyLayoutRu[index] : keyLayoutShiftDown[index];
        }
      }
    });
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});

// window.addEventListener('keydown', function (e) {
//   console.log(e.code);
//   console.log(e.key);
// });
