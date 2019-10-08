'use strict';
document.addEventListener('DOMContentLoaded', ()=>{
    // keyboard
    {
        const keyboardButton = document.querySelector('.search-form__keyboard');
        const keyboard = document.querySelector('.keyboard');
        const searchInput = document.querySelector('.search-form__input');
        const keyboardClose = document.getElementById('close-keyboard');
        const backspace = document.getElementById('keyboard-backspace');
        
        const toggleKeyboard = () => {
            keyboard.style.top = keyboard.style.top ? '' : '50%';
        }

        const typing = (e) => {
            const target = e.target;
            if(target.tagName.toLowerCase() === 'button'){
                if(target === backspace) {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else {
                    searchInput.value += target.textContent.trim();
                    if(target.textContent === '') {
                        searchInput.value += ' ';
                    }
                }
            }
        }

        keyboardButton.addEventListener('click', toggleKeyboard);

        keyboardClose.addEventListener('click', toggleKeyboard);

        keyboard.addEventListener('click', typing);

    }

    // sidebar
    {
        const burger = document.querySelector('.spinner');
        const sidebarMenu = document.querySelector('.sidebarMenu');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            sidebarMenu.classList.toggle('rollUp')
        });

        sidebarMenu.addEventListener('click', (e) => {
            let target = e.target;
            target = target.closest('a[href="#"');

            if(target) {
                const parentTarget = target.parentElement;
                sidebarMenu.querySelectorAll('li').forEach((i) => {
                    if(i === parentTarget) {
                        i.classList.add('active');
                    } else {
                        i.classList.remove('active');
                    }
                })
            }
        })
    }

});

