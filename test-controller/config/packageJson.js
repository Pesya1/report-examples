import readJson from 'read-package-json';
import config from './index.js';
import util from 'util';
const readJsonAsync = util.promisify(readJson);

//read package.json and add it to config.package
const packageJson = async () => {
    try {
        let data = await readJsonAsync("./package.json");
        config.package = data;
    } catch (err) {
        throw err;
    }
}

export default packageJson