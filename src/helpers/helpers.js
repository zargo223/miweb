const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../db/data.json');
const DATA_FILE_TWO = path.join(__dirname, '../db/session.json');

// Other routes

const loadData = () => {
    try {
        const dataString = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(dataString);
    } catch (error) {
        console.error('Error get data:', error.message);
        return [];
    }
}

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
    } catch (error) {
        console.error('Error to save data: ', error.message);
    }
}

const loadDataAuth = () => {
    try {
        const dataString = fs.readFileSync(DATA_FILE_TWO, 'utf8');
        return JSON.parse(dataString);
    } catch (error) {
        console.error('Error get data:', error.message);
        return [];
    }
}


const saveDataAuth = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_TWO, JSON.stringify(data), 'utf8');
    } catch (error) {
        console.error('Error to save data: ', error.message);
    }
}


let ipsData = loadDataAuth();

const deleteDataAuth = (clientIP) => {
    try {
        ipsData = ipsData.filter(link => link !== clientIP);
        saveDataAuth(ipsData);
    } catch (error) {
        console.error('Error to delete data: ', error.message);
    }
}

module.exports = { loadData, saveData, loadDataAuth, saveDataAuth, deleteDataAuth };