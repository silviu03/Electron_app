const electron = require('electron');
const xlsx = require('xlsx');
const { app, BrowserWindow, ipcMain } = electron;

app.disableHardwareAcceleration();

let mainWindow;


const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './database/database.sqlite'
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
        },
        width: 1400, 
        height: 900
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
})

ipcMain.on('getRecords', (event) => {
    knex('clients')
        .select({ id: 'id', name: 'name' })
        .then((records) => {
            console.log(records);
            mainWindow.webContents.send('clients:all', records);
        })
        .catch((err) => {
            console.error(err);
        });

    knex('products')
        .select({ id: 'id', name: 'name' })
        .then((records) => {
            console.log(records);
            mainWindow.webContents.send('products:all', records);
        })
        .catch((err) => {
            console.error(err);
        });

    knex('parts')
        .select({ id: 'id', pn: 'pn', description: 'description', quantity: 'quantity', stock: 'stock' })
        .then((records) => {
            console.log(records);
            mainWindow.webContents.send('parts:all', records);
        })
        .catch((err) => {
            console.error(err);
        });

})

ipcMain.on('client:add', (event, clientName) => {
    knex('clients')
        .insert({ name: clientName, created_at: 'test', updated_at: 'test' })
        .then((id) => {
            knex('clients')
                .select({
                    id: 'id',
                    name: 'name'
                })
                .where({ id })
                .then((record) => {
                    console.log(record);
                })
        })
        .catch((err) => {
            console.error(err);
        });
})

ipcMain.on('product:add', (event, prodName) => {
    console.log(prodName);
    knex('products')
        .insert({ name: prodName, description: 'test', created_at: 'test', updated_at: 'test' })
        .then((id) => {
            knex('products')
                .select({
                    id: 'id',
                    name: 'name'
                })
                .where({ id })
                .then((record) => {
                    console.log(record);
                })
        })
        .catch((err) => {
            console.error(err);
        });
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

        console.log(row)

        knex('parts')
        .insert({ pn: row.partNumber, description: row.partDescription, quantity: row.partQuantity, stock: 5, created_at: 'test', updated_at: 'test' })
        .then((id) => {
            knex('parts')
                .select({
                    id: 'id'
                })
                .where({ id })
                .then((record) => {
                    console.log(record);
                })
        })
        .catch((err) => {
            console.error(err);
        });
    }

    knex('parts')
        .select({ id: 'id', pn: 'pn', description: 'description', quantity: 'quantity', stock: 'stock' })
        .then((records) => {
            console.log(records);
            mainWindow.webContents.send('parts:all', records);
        })
        .catch((err) => {
            console.error(err);
        });

    // mainWindow.webContents.send('file:rows', rowsToSend)
})



