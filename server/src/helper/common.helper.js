const crypto = require("crypto");
const { v4: uuidv4} = require("uuid");
const config = require("../../config/config");

const encodeBase64 = (data) => Buffer.from(data).toString("base64");

const decodeBase64 = (data) => Buffer.from(data, "base64").toString("ascii");

const generateRandomString = (length) => 
    crypto.randomBytes(length).toString("hex");

const generateRandomNumber = () => Math.floor(Math.random() * 1000000);

const generateUUID = () => uuidv4();

const encryptPassword = (password) => {
    const salt = Buffer.from(config.salt, "hex");
    const key = crypto.pbkdf2Sync(config.secretKey, salt, 100000, 32, 'sha512');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString('hex') + encrypted;
};

const decryptPassword = (password) => {
    const salt = Buffer.from(config.salt, "hex");
    const key = crypto.pbkdf2Sync(config.secretKey, salt, 100000, 32, 'sha512');
    const iv = Buffer.from(password.slice(0, 32), 'hex'); 
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(password.slice(32), "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

const comparePassword = (password, hashPassword) => password == decryptPassword(hashPassword);

module.exports = {
    encodeBase64,
    decodeBase64,
    generateRandomString,
    generateRandomNumber,
    generateUUID,
    encryptPassword,
    decryptPassword,
    comparePassword
}