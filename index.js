const electron = require('electron');
const xlsx = require('xlsx');
const { app, BrowserWindow, ipcMain } = electron;

app.disableHardwareAcceleration();

let mainWindow;

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./database/database.sqlite"
    },
    useNullAsDefault: true,
    log: {
        warn(message) {
            console.log(message)
        },
        error(message) {
            console.error(message)
        },
        deprecate(message) {
            console.log(message)
        },
        debug(message) {
            console.log(message)
        }
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

})

ipcMain.on('client:add', (event, clientName) => {
    console.log(clientName);
    knex.insert({ id: 1, name: 'clientName', created_at: 'test', updated_at: 'test' }).into("clients");
    
})

ipcMain.on('product:add', (event, prodName) => {
    console.log(prodName);
    knex("products").insert({ name: prodName });
})

ipcMain.on('file:submit', (event, path) => {

    const partNumber = 0;
    const partDescription = 1;
    const partQuantity = 2;
    const workbook = xlsx.readFile(path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    const rowsToSend = [];

    for (let i = 1; i < rows.length; i++) {
        const row = {
            partNumber: rows[i][partNumber],
            partDescription: rows[i][partDescription],
            partQuantity: rows[i][partQuantity]
        }
        rowsToSend.push(row);

    }
    mainWindow.webContents.send('file:rows', rowsToSend)

})


