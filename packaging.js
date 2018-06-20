const fs = require('fs');
const semver = require('semver');
const exec = require('child_process').exec;

const masterPackageJson = require('./package.json');

var _continue = true;

var _settings = {
    version: masterPackageJson.version,
    allowedVersionings: [
        "patch",
        "major",
        "minor"
    ],
    package: true,
    publish: false,
    packagePath: './build-vsix/'
}

for(i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
    switch(process.argv[i]) {
        case '-v':
        case '--version':
            if(process.argv[i + 1] !== null) {
                _settings.version = process.argv[i + 1];
                i++;
                break;
            }
        case '--package':
            _settings.package = true;
            _settings.publish = false;
            break;
        case '--publish':
            _settings.publish = true;
            _settings.package = false;
            break;
        case '-h':
        case '--help':
            console.log('Usage: node [packaging | packaging.js] [arguments]');
            console.log('       npm run package [arguments]');
            console.log('');
            console.log('Options:');
            console.log('   -v, --version [<newversion> | major | minor | patch]');
            i = process.argv.length + 1;
            _continue = false;
            break;
        default:
            break;
    }
}

if(_continue === true) {
    doItAll();
}

function doItAll() {
    return Promise.all([
        processVersion(_settings, '.'),
        processVersion(_settings, 'client'),
        processVersion(_settings, 'server')
    ])
    .then(function () {
        return processPackage(_settings);
    })
    .catch(function(error) {
        console.log(error);
    });
}

function processPackage (settings) {
    return new Promise(function (resolve, reject) {
        if(settings.package === true) {
            exec('cd client && vsce package', function (error) {
                if(error !== null) {
                    console.log(error);
                    reject(error);
                }
                resolve();
            });
        }
        else if(settings.publish === true) {
            exec('cd client && vsce publish', function (error) {
                if(error !== null) {
                    console.log(error);
                    reject(error);
                }
                resolve();
            });
        }
    });
}

function processVersion (settings, relativePath) {
    return new Promise(function (resolve, reject) {
        if(semver.valid(settings.version) || settings.allowedVersionings.includes(settings.version)) {
            var command = 'cd ' + relativePath + ' && npm version ' + settings.version;
            if(settings.package === true) {
                command = command + ' --no-git-tag-version';
            }
            exec(command,
            function (error, stdout, stderr) {
                if(error !== null) {
                    console.log(error);
                    reject(error);
                }
                resolve();
            });
        }
    });
}