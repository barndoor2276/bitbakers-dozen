var fs = require('fs');

const masterPackage = require('./package.json');

var clientPackagePath = './client/package.json';
var serverPackagePath = './server/package.json';

var clientPackage = require(clientPackagePath);
var serverPackage = require(serverPackagePath);

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
.then(function (clientHasChanges, clientReturnPackage, serverHasChanges, serverReturnPackage) {
    console.log('Successfully assigned all client and server package.json settings from master.');
    return Promise.all(
        [
            writePackageToFile(clientPackagePath, clientReturnPackage, clientHasChanges),
            writePackageToFile(serverPackagePath, serverReturnPackage, serverHasChanges)
        ]);
})
.then(function () {
    console.log('Successfully wrote all client and server package.json settings to file.');
})
.catch(function (error) {
    console.log('Error: Did not assign all client and server package.json settings from master.');
});

function assignPackageSettings (settingsArray) {
    return new Promise(function(resolve, reject) {
        var clientHasChanges = false;
        var serverHasChanges = false;

        for(count = 0; count < settingsArray.length; count++) {
            if(settingsArray[count][0] !== settingsArray[count][1]) {
                console.log('Assigning ' + settingsArray[count][0] + ' to client package.json');
                clientHasChanges = true;
                settingsArray[count][1] = settingsArray[count][0];
            }
            if(settingsArray[count][0] !== settingsArray[count][2]) {
                console.log('Assigning ' + settingsArray[count][0] + ' to server package.json');
                serverHasChanges = true;
                settingsArray[count][2] = settingsArray[count][0];
            }
        }
        resolve(clientHasChanges, serverHasChanges);
    });
};

function writePackageToFile (pathDestination, packageJson, hasChanges) {
    return new Promise(function(resolve, reject) {
        if(hasChanges === true) {
            fs.writeFile(pathDestination, packageJson, function (err) {
                if (err) {
                    var errMessage = 'There was an error writing the package.json to file.';
                    logger.error(errMessage + ' : ' + err.message);
                    reject(new Error(errMessage));
                }
                logger.info('Wrote to ' + pathDestination);
            });
        }
        resolve();
    });
}