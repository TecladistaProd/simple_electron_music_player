const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs-promise')

process.env.NODE_ENV = 'production'

let mainWin = null, volumeWin = null
let createWin = ((file, obj = {})=>{
    let win 
    obj.width = obj.width || 800
    obj.height = obj.height || 600
    obj.show = obj.show || true
    obj.minHeight = 76
    obj.minWidth = 523
    win = new BrowserWindow(obj)
    win.loadURL(url.format({
        pathname: path.join(__dirname, `views/${file}.html`),
        protocol: 'file',
        slashes: true
    }))
    return win
})

app.on('ready', () => {
    mainWin = createWin('main')
    mainWin.once('ready-to-show', () => mainWin.show())
    mainWin.on('closed', () => app.quit())
    const mainMenu = Menu.buildFromTemplate(mainMenuTp)
    Menu.setApplicationMenu(mainMenu)
})
function addFile(){
    dialog.showOpenDialog({
        title: 'Chose File',
        filters: [
            { name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'wma', 'mid']}
        ],
        properties: ['openFile', 'multiSelections']
    }, files=>{
        if(files)
            mainWin.webContents.send('files', files)
    })
}

ipcMain.on('random', (e, f)=> console.log(f))

function addPath(){
    dialog.showOpenDialog({
        title: 'Chose Path',
        properties: ['openFile', 'openDirectory']
    }, files => {
        if (files){
            let archives = []
            fs.readdir(files[0]).then(e=>{
                e.forEach(f=>{
                    let type = f.split('.')[1]
                    if(type === 'mp3' || type === 'wav' || type === 'ogg' || type === 'wma' || type === 'mid'){
                        let x = path.join(files[0], f)
                        archives.push(x)
                    }
                })
                mainWin.webContents.send('files', archives)
            })
        }
    })
}

const mainMenuTp = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Chose File(s)',
                accelerator: 'CommandOrControl+O',
                click() { addFile() }
            },
            {
                label: 'Chose Path',
                accelerator: 'CommandOrControl+P',
                click() { addPath() }
            },
            {
                label: 'Quit',
                accelerator: 'CommandOrControl+Q',
                click() { app.quit() }
            }
        ]
    }
]

if (process.platform == 'darwin')
    mainMenuTp.unshift({})

if (process.env.NODE_ENV !== 'production')
    mainMenuTp.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toogle Devtools',
                accelerator: 'CommandOrControl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            { role: 'reload' }
        ]
    })