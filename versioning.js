var fs = require('fs');

const masterPackage = require('./package.json');
var clientPackage = require('./client/package.json');
var serverPackage = require('./server/package.json');

var clientHasChanges = false;
var serverHasChanges = false;

var packageSettingsToSync =
[ 
    [masterPackage.name, clientPackage.name, serverPackage.name],
    [masterPackage.description, clientPackage.description, serverPackage.description],
    [masterPackage.author, clientPackage.author, serverPackage.author],
    [masterPackage.license, clientPackage.license, serverPackage.license],
    [masterPackage.version, clientPackage.license, serverPackage.license],
    [masterPackage.publisher, clientPackage.publisher, serverPackage.publisher],
    [masterPackage.bugs.url, clientPackage.bugs.url, serverPackage.bugs.url],
    [masterPackage.homepage, clientPackage.homepage, serverPackage.homepage],
    [masterPackage.repository.type, clientPackage.repository.type, serverPackage.repository.type],
    [masterPackage.repository.url, clientPackage.repository.url, serverPackage.repository.url]
];

assignPackageSettings(packageSettingsToSync)
.then(function () {
    console.log('Successfully assigned all client and server package.json settings from master.');
    return Promise.all(
        [
            writePackageToFile(),
            writePackageToFile()
        ]);
})
.then(function () {
    console.log('Successfully wrote all client and server package.json settings to file.');
})
.catch(function (error) {
    console.log('Error: Did not assign all client and server package.json settings from master.');
});

function assignPackageSettings (packageJson) {
    return new Promise(function(resolve, reject) {
        for(var item in packageJson) {
            console.log('Assigning ' + item[0] + ' to client package.json');
            item[1] = item[0];
            console.log('Assigning ' + item[0] + ' to server package.json');
            item[2] = item[0];
        }
        resolve();
    });
};

function writePackageToFile (pathDestination, packageJson) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(pathDestination, packageJson, function (err) {
            if (err) {
                var errMessage = 'There was an error writing the package.json to file.';
                logger.error(errMessage + ' : ' + err.message);
                reject(new Error(errMessage));
            }
            logger.info('Wrote to ' + pathDestination);
            resolve();
        });
    });
}