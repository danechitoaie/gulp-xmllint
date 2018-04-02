const path = require('path');
const fs = require('fs');
const through2 = require('through2');
const xsdSchemaValidator = require('xsd-schema-validator');
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');

module.exports = (xmlPath, xsdPath) => {
    const xmlFilePath = path.relative(process.cwd(), xmlPath);
    const xsdFilePath = path.relative(process.cwd(), xsdPath);

    return through2.obj(function(file, encoding, callback) {
        if (!fs.existsSync(xmlFilePath)) {
            this.emit('error', new PluginError('gulp-xmllint', xmlFilePath + ' does not exist!'));
            return;
        }

        if (!fs.statSync(xmlFilePath).isFile()) {
            this.emit('error', new PluginError('gulp-xmllint', xmlFilePath + ' is not a file!'));
            return;
        }

        if (!fs.existsSync(xsdFilePath)) {
            this.emit('error', new PluginError('gulp-xmllint', xsdFilePath + ' does not exist!'));
            return;
        }

        if (!fs.statSync(xsdFilePath).isFile()) {
            this.emit('error', new PluginError('gulp-xmllint', xsdFilePath + ' is not a file!'));
            return;
        }

        xsdSchemaValidator.validateXML({file: xmlFilePath}, xsdFilePath, (err, data) => {
            if (err) {
                fancyLog.error(data.result + ' ' + xmlPath);
                fancyLog.error(err.message);
                this.emit('error', new PluginError('gulp-xmllint', 'Failed to validate XML file!'));
                return;
            } else {
                callback(null, file);
            }
        });
    });
};