let select = function() {
    let left_arrow_selectors = document.querySelectorAll('.arrow-left');
    let right_arrow_selectors = document.querySelectorAll('.arrow-right');

    right_arrow_selectors.forEach(item => {
        item.addEventListener('click', right_click)
    });

    left_arrow_selectors.forEach(item => {
        item.addEventListener('click', left_click)
    });

    function left_click() {
        let select = this.closest('.arrow-selector'),
            currentText = select.querySelector('.current_arrow-selector'),
            selectItem = select.querySelectorAll('.arrow__select__item');
        for (let i = 0; i < selectItem.length; i++) {
            if (selectItem[i].textContent == currentText.textContent) {
                if (i) {
                    currentText.innerText = selectItem[i - 1].textContent;
                } else {
                    currentText.innerText = selectItem[selectItem.length - 1].textContent;
                }
                break;
            }
        }
        atr = getNT(select);
        Menufunctions(atr[0], atr[1]);
    }

    function right_click() {
        let select = this.closest('.arrow-selector'),
            currentText = select.querySelector('.current_arrow-selector'),
            selectItem = select.querySelectorAll('.arrow__select__item');
        for (let i = 0; i < selectItem.length; i++) {
            if (selectItem[i].textContent == currentText.innerText) {
                if (i == selectItem.length - 1) {
                    currentText.innerText = selectItem[0].textContent;
                } else {
                    currentText.innerText = selectItem[i + 1].textContent;
                }
                break;
            }
        }
        atr = getNT(select);
        Menufunctions(atr[0], atr[1]);
    }
}

function left_click_name(name) {
    let select = document.querySelector('.change-' + name),
        currentText = select.querySelector('.current_arrow-selector'),
        selectItem = select.querySelectorAll('.arrow__select__item');
    for (let i = 0; i < selectItem.length; i++) {
        if (selectItem[i].textContent == currentText.textContent) {
            if (i) {
                currentText.innerText = selectItem[i - 1].textContent;
            } else {
                currentText.innerText = selectItem[selectItem.length - 1].textContent;
            }
            break;
        }
    }
    atr = getNT(select);
    Menufunctions(atr[0], atr[1]);
}

function right_click_name(name) {
    let select = document.querySelector('.change-' + name),
        currentText = select.querySelector('.current_arrow-selector'),
        selectItem = select.querySelectorAll('.arrow__select__item');
    for (let i = 0; i < selectItem.length; i++) {
        if (selectItem[i].textContent == currentText.innerText) {
            if (i == selectItem.length - 1) {
                currentText.innerText = selectItem[0].textContent;
            } else {
                currentText.innerText = selectItem[i + 1].textContent;
            }
            break;
        }
    }
    atr = getNT(select);
    Menufunctions(atr[0], atr[1]);
}

async function Menufunctions(name, atr) {
    if (name == 'text_file') {config['file'] = atr, updateTextLine()}
    if (name == 'repetition') {config['repetition'] = atr, updateTextLine()}
    if (name == 'font_size') {config['font_size'] = atr, checkStatusFontSize()}
    if (name == 'numbering') {config['numbering'] = atr, checkStatusNumbering()}
    if (name == 'translation') {config['translation'] = atr, checkTranslation()}
    await eel.saveConfig(config)();
}

function getNT(selector) {
    sName = String(selector.classList[1]).replace('change-', '');
    sText = selector.querySelector('.current_arrow-selector').textContent;
    return [sName, sText];
}

function checkTranslation() {
    if (startLength && !finish) {
        if(Number(config['translation'])) {
            document.querySelector('.text').innerHTML = translation;
        } else {
            document.querySelector('.text').innerHTML = word;
        }
    }
}

function checkStatusFontSize() {
    textLine = document.querySelector('.text')
    textLine.style.fontSize = String(config['font_size']) + 'px';
}

function checkStatusNumbering() {
    numbering = document.querySelector('.numbering')
    if(config['numbering'] == 'on') {
        numbering.classList.remove('black');
        numbering.classList.add('white');
    } else {
        numbering.classList.remove('white');
        numbering.classList.add('black');
    }
}