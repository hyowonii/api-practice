import fs from 'fs';    // nodejs 제공기능
import { resolve } from 'path';   // nodejs 제공기능

const basePath = resolve();   // = 현재경로

const filenames = {
  messages: resolve(basePath, "src/db/messages.json"),
  users: resolve(basePath, "src/db/users.json")
}

export const readDB = target => {     // target: messages or users
  try {
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'))
  } catch (err) {
    console.log(err);
  }
}

export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data))
  } catch (err) {
    console.log(err);
  }
}