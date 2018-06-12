import { forEachChild } from "typescript";

const masterPackage = require('package.json');
const clientPackage = require('client/package.json');
const serverPackage = require('server/package.json');

var clientHasChanges = false;
var serverHasChanges = false;

var watchedPackageSettings =
{ 
    "name": masterPackage.name,
    "description": masterPackage.description,
    "author": masterPackage.author,
    "license": masterPackage.license,
    "version": masterPackage.version,
    "publisher": masterPackage.publisher,
    "bugs": {
        "url": masterPackage.bugs.url
    },
    "homepage": masterPackage.homepage,
    "repository": {
        "type": masterPackage.repository.type,
        "url": masterPackage.repository.url
    }
}