import eel
import os
import subprocess
import pickle
import datetime

eel.init('web')


@eel.expose
def createFilesIfNotExists():

    """createFilesIfNotExists()
    
    Checks the availability of all necessary files for the program, 
    and in their absence creates them
    """

    if not os.path.isdir("words"):
        os.mkdir("words")
    
    if not os.path.isdir("RE"):
        os.mkdir("RE")

    if not os.path.isfile('config.pickle'):
        file = open('config.pickle', 'wb')
        deafult = {
            "file": 'words', 
            "repetition": 'off', 
            "font_size": '100', 
            "numbering": 'off', 
            "translation": '0'
        }
        pickle.dump(deafult, file)
        file.close()

    if not os.path.isfile('update.pickle'):
        file = open('update.pickle', 'wb')
        pickle.dump(datetime.datetime.date(datetime.datetime.now()) - datetime.timedelta(days = 1), file)
        file.close()

    if not os.path.isfile('words\\[ RE ].txt'):
        file = open('words\\[ RE ].txt', 'w', encoding="utf-8")
        file.close()

    if not os.path.isfile('words\\[ LEARN ].txt'):
        file = open('words\\[ LEARN ].txt', 'w', encoding="utf-8")
        file.close()
    
    if not os.path.isfile('words\\[ ALL ].txt'):
        file = open('words\\[ ALL ].txt', 'w', encoding="utf-8")
        file.close()
    
    if not os.path.isfile('REList.pickle'):
        file = open('REList.pickle', 'wb')
        file.close()


@eel.expose
def openFile(fileName):

    """openFile(fileName)

    Opens a file from the "words" directory in Notepad
    """

    osCommandString = f"notepad.exe words\\{fileName}.txt"
    subprocess.call(osCommandString, shell=True)

@eel.expose
def getMas(fileName):

    """getMas(fileName)
    
    Returns an array [word / translation] from the specified file
    """

    f = open(f'words\\{fileName}.txt', 'r', encoding="utf-8")
    temp = f.readlines()
    txt = []
    for i in temp:
        txt += [[i[0:i.find('|')],i[i.find('|') + 1:].replace('\n', '')]]
    f.close()
    return txt


@eel.expose
def getFilesName():

    """getFilesName()
    
    Returns all filenames from the "words" directory
    """

    temp = os.listdir(os.getcwd() + '\words')
    mas = []
    for i in temp:
        if [i.replace('.txt', '')] != [i]:
            mas += [i.replace('.txt', '')]
    if mas == []:
        f = open('words\words.txt', 'w')
        f.close()
        mas = ['words']
    return mas


@eel.expose
def getConfig(masFiles):

    """getConfig(masFiles)
    
    Returns the configuration and checks it for correctness
    """

    file = open('config.pickle', 'rb')
    config = pickle.load(file)
    if config['file'] not in masFiles:
        config['file'] = masFiles[0]
    file.close()
    return config
    

@eel.expose
def saveConfig(config):

    """saveConfig(config)
    
    Saves the configuration
    """

    file = open('config.pickle', 'wb')
    pickle.dump(config, file)
    file.close()


@eel.expose
def initialRe():

    """initialRe()
    
    Initializes the file "[ RE ]" according to the dates of the file "ReList"
    """

    file = open('update.pickle', 'rb')
    lastUpdate = pickle.load(file)
    file.close()
    if str(lastUpdate) != str(datetime.datetime.date(datetime.datetime.today())):
        file = open('words\\[ RE ].txt', 'w')
        filesToRe = getReFilesNameForToday(getInfoReFiles())

        text = getTextFromFiles(filesToRe)

        file.write(text)
        file.close()
        updateReList()


def getReFilesNameForToday(mas):

    """getReFilesNameForToday(mas)
    mas - list of ReList objects
    
    Returns a list of filenames to repeat
    """

    sort = []
    for i in mas:
        if datetime.datetime.date(datetime.datetime.strptime(i[0], f"%Y-%m-%d")) == datetime.datetime.date(datetime.datetime.today()):
            sort += [i[2]]
    return sort


def getInfoReFilesName():

    """getInfoReFilesName()
    
    Returns the names of all RE files
    """

    file = open('REList.pickle', 'rb')
    mas = []
    try:
        mas = pickle.load(file)
    except:
        pass
    file.close()
    names = []
    for i in mas:
        names += [i[2]]
    return names


def getInfoReFiles():

    """getInfoReFiles()
    
    Returns a list of all ReList objects and corrects obsolete dates
    """

    file = open('REList.pickle', 'rb')
    mas = []
    try:
        mas = pickle.load(file)
    except:
        pass
    file.close()
    fixDateRe(mas)
    return mas


def fixDateRe(mas):

    """fixDateRe(mas)
    mas - list of ReList objects

    Corrects obsolete dates
    """

    for i in mas:
        if datetime.datetime.strptime(i[0], f"%Y-%m-%d") < datetime.datetime.today():
            i[0] = str(datetime.datetime.date(datetime.datetime.now()))


def getTextFromFiles(files):

    """getTextFromFiles(files)

    Returns text from files
    """

    text = ''
    for i in files:
        file = open(f'RE\\{i}.txt', 'r')
        for j in file.readlines():
            text += j
        text += '\n'
        file.close()
    return text


def updateReList():

    """updateReList()
    
    Updates data in REList
    """

    file = open('REList.pickle', 'rb')
    mas = []
    try:
        mas = pickle.load(file)
    except:
        pass
    file.close()
    fixDateRe(mas)
    for i in mas:
        if datetime.datetime.date(datetime.datetime.strptime(i[0], f"%Y-%m-%d")) == datetime.datetime.date(datetime.datetime.today()):
            i[0] = str(datetime.datetime.date(datetime.datetime.now()) + datetime.timedelta(days = int(i[1])))
            i[1] = str(int(i[1]) * 2)
    file = open('REList.pickle', 'wb')
    pickle.dump(mas, file)
    file.close()

    file = open('update.pickle', 'wb')
    pickle.dump(datetime.datetime.date(datetime.datetime.now()), file)
    file.close()


@eel.expose
def REFile():

    """REFile()
    
    Creates a Re file from "[ LEARN ]" and adds it to the ReList
    """

    file = open('words\\[ LEARN ].txt', 'r', encoding="utf-8")
    text = file.readlines()
    file.close()
    file = open('words\\[ LEARN ].txt', 'w', encoding="utf-8")
    file.seek(0)
    file.close()


    fileName = getLastFileName() + 1
    file = open(f'RE\\{fileName}.txt', 'w', encoding="utf-8")
    for i in text:
        file.write(i)
    file.close()

    saveInfoReFile(fileName)
    initialALL(text)
    

def saveInfoReFile(fileName):

    """saveInfoReFile(fileName)
    fileName - file name
    
    Adds a file to the ReList
    """

    date = datetime.datetime.date(datetime.datetime.now()) + datetime.timedelta(days = 1)

    status = True
    try:
        file = open('REList.pickle', 'rb')
        mas = pickle.load(file)
        file.close()
    except:
        status = False

    file = open('REList.pickle', 'wb')
    if status:
        pickle.dump(mas + [[str(date), 1, fileName]], file)
    else:
        pickle.dump([[str(date), 1, fileName]], file)
    file.close()


def getLastFileName():

    """getLastFileName()
    
    Returns the number of the last file
    """

    myList = os.listdir(os.getcwd() + '\RE')
    if myList == []:
        return 0

    for i in range(0, len(myList)):
        myList[i] = int(myList[i].replace('.txt', ''))

    return max(myList)


def initialALL(text):

    """initialALL(text)
    
    Adds text to the "[ ALL ]" file
    """

    file = open('words\\[ ALL ].txt', 'a', encoding="utf-8")
    for i in text:
        file.write(i)
    file.write('\n')
    file.close()

eel.start('main.html')