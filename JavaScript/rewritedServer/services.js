'use strict';

const fs = require('node:fs').promises;

const personGetService = async () => {
  try {
    const data = await fs.readFile('./person.json');
    const obj = JSON.parse(data);
    obj.birth = new Date(obj.birth);
    const difference = new Date() - obj.birth;
    obj.age = Math.floor(difference / 31536000000);
    delete obj.birth;
    const sobj = JSON.stringify(obj);
    return sobj;
  } catch (e) {
    return false;
  }
}

const personPostService = async (obj) => {
  try {
    if (obj.name) obj.name = obj.name.trim();
    const data = JSON.stringify(obj);
    await fs.writeFile('./person.json', data);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = {
  personGetService,
  personPostService
}
