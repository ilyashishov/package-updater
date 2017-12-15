"use strict";
const electron = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const fs = require('fs');
const {execSync, exec } = require('child_process');

let names = [];
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let dirName = '';
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 600, 
    height: 400,
    icon : "assets/icon.ico",
    title: 'Package Updater'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  };
});


ipc.on('open-file-dialog', event => {
  dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] }, files => {
    if (files) {
      event.sender.send('selected-directory', files);
      dirName = files;
    };
  });
});

ipc.on('add-package-name', (event, packageName) => {
  names.push(packageName);
});

ipc.on('remove-package-name', (event, packageName) => {
  names.splice(names.indexOf(packageName), 1);
});

ipc.on('update-start', () => {
  execSync(`Start "" CMD /K node ${__dirname}\\index.js ${dirName} ${names}`, {stdio:[0,1,2]});
});

ipc.on('open-error-dialog-no-directory', () => {
  dialog.showErrorBox('Error', 'No directory');
});

ipc.on('open-error-dialog-no-package', () => {
  dialog.showErrorBox('Error', 'No package');
});