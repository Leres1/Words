text = [];
config = [];
masFiles = [];
switches = ['on', 'off'];
size = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150];
startLength = 0;
count = 0;
translation = ''
word = ''
REFlag = false;
finish = false;


document.onkeydown = function(event) {
    if(!KeyCheack(event.key)) {
        randomWordInTextLine();
    }
}

document.onkeyup = function(event) {
    if(event.key == 'r' || event.key == 'к' || event.key == 'R' || event.key == 'К') {
        REFlag = false;
    }
}

async function start(){
    await checkFiles();
    await initialFilesMas();
    await initialConfig();
    await initialRepeat();
    await initialText();
    initialization_MenuOptions();
    select();
    randomWordInTextLine();
    checkStatusFontSize();
    checkStatusNumbering();
}

async function checkFiles() {
    await eel.createFilesIfNotExists()();
}

async function initialRepeat() {
    await eel.initialRe()();
}

async function updateTextLine() {
    await initialText();
    randomWordInTextLine();
}

function initialization_MenuOptions() {
    initialMenuSettings('Text File', masFiles);
    initialMenuSettings('Repetition', switches);
    initialMenuSettings('Font Size', size);
    initialMenuSettings('Numbering', switches);
    initialMenuSettings('Translation', [0, 1]);
}

function createECI(element, classes='', inner='') {
    htmlCode = document.createElement(element);
    if(classes != '') {
        htmlCode.className = classes;
    }
    htmlCode.innerHTML = inner;
    return htmlCode
}

function initialMenuSettings(name, range) {
    config_name = String(name).replace(' ', '_').toLowerCase()
    main = ''
    if (config_name == 'text_file') {main = String(config['file'])}
    if (config_name == 'repetition') {main = String(config['repetition'])}
    if (config_name == 'font_size') {main = String(config['font_size'])}
    if (config_name == 'numbering') {main = String(config['numbering'])}
    if (config_name == 'translation') {main = String(config['translation'])}


    div = createECI("DIV", "menuOptions unselectable");
    div.appendChild(createECI("DIV", "name-option", name));

    div2 = createECI("DIV", "arrow-selector change-" + config_name + " unselectable");
    div2.appendChild(createECI('I',"arrow-left"));

    div3 = createECI("DIV", "current_arrow-selector");
    div3.innerHTML = main;
    div2.appendChild(div3);

    for(i in range){
        div2.appendChild(createECI("DIV", "arrow__select__item", String(range[i])));
    }
    div2.appendChild(createECI('I',"arrow-right"));
    div.appendChild(div2);
    document.querySelector('.burger-menu__nav').appendChild(div);
}

async function initialText() {
    text = await eel.getMas(config['file'])();
    startLength = text.length;
    finish = false;
    count = 0;
}

async function initialConfig(){
    config = await eel.getConfig(masFiles)();
}

async function initialFilesMas(){
    masFiles = await eel.getFilesName()();
}

function KeyCheack(key) {
    console.log(key)
    if(key == 'ArrowRight') {
        right_click_name('text_file');
        return true;
    }
    if(key == 'ArrowLeft') {
        left_click_name('text_file');
        return true;
    }
    if(key == 'r' || key == 'к' || key == 'R' || key == 'К') {
        REFlag = true;
        return true;
    }
    if((key == 'e' || key == 'у' || key == 'E' || key == 'У') && REFlag) {
        eel.REFile()();
        REFlag = false;
        return true;
    }
    if(key == 'F11') {
        return true;
    }
    if(key == 'Tab') {
        updateTextLine();
        return true;
    }
    if(key == ' ') {
        left_click_name('translation')
        return true;
    }
    if(key == 'o' || key == 'щ' || key == 'O' || key == 'Щ') {
        eel.openFile(config['file'])();
        return true;
    }
    if (key == 'Escape') {
        menu = document.querySelector('#menu');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
        return true;
    }
    return false;
}

function randomWordInTextLine(){
    num = Math.floor(Math.random() * text.length);
    if(text.length == 0) {
        document.querySelector('.text').innerHTML = 'Words are finished <br /> <br />Tab to restart';
        if(config['repetition'] != 'on') {
            document.querySelector('.numbering').innerHTML = startLength + ' / ' + startLength;
        }else{
            document.querySelector('.numbering').innerHTML = '0';
        }
        finish = true;
    }else {
        word = text[num][0];
        translation = text[num][1];
        document.querySelector('.text').innerHTML = text[num][config['translation']];
        numbering = document.querySelector('.numbering');
        if(config['repetition'] != 'on') {
            text.splice(num, 1)
            numbering.innerHTML = startLength - text.length + ' / ' + startLength;
        } else {
            numbering.innerHTML = count;
            count++;
        }
    }
}

start();