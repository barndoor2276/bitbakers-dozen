const fs = require('fs');
const exec = require('child_process').exec;

var _version;

for(i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
    switch(process.argv[i]) {
        case '-v':
        case '--version':
            if(process.argv[i + 1] !== null) {
                _version = process.argv[i + 1];
                processVersion(_version);
                i++;
                break;
            }
        case '-h':
        case '--help':
        default:
            console.log('Usage: node [packaging | packaging.js] [arguments]');
            console.log('       npm run package [arguments]');
            console.log('');
            console.log('Options:');
            console.log('   -v, --version [<newversion> | major | minor | patch]');
            break;
    }
}

function processVersion (semVersion) {
    return new Promise(function (resolve, reject) {
        exec('npm version ' + semVersion, function (error) {
            if(error !== null) {
                console.log(error);
                reject(error);
            }
            exec('cd client && npm version ' + semVersion, function (error) {
                if(error !== null) {
                    console.log(error);
                    reject(error);
                }
                exec('cd ../server && npm version ' + semVersion + ' && cd ..', function (error) {
                    if(error !== null) {
                        console.log(error);
                        reject(error);
                    }
                    resolve();
                });
            });
        });
    });
}