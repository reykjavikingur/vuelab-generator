#!/usr/bin/env node

const pkg = require('./package');
const Path = require('path');
const gnat = require('gnat');
const Promise = require('promise');
const child_process = require('child_process');

function main(args) {
    var command = args.shift();
    if (!command) {
        usage();
    }
    else if (command == 'init') {
        var path = args.shift();
        if (!path) {
            console.error('ERROR: You must specify a project directory.');
            process.exit(1);
        }
        else {
            console.log('');
            console.log('Cloning into directory:', path);
            console.log('Please answer the following questions about your project (press enter to use the default):');
            gnat.clone('https://github.com/reykjavikingur/vuelab.git', path)
                .then(r => {
                    console.log('');
                    console.log('vuelab clone complete');
                    console.log('Changing directory:', path);
                    process.chdir(path);
                }, e => {
                    console.error('vuelab clone failed', e);
                    process.exit(1);
                })
                .then(r => {
                    return exec('npm install');
                })
                .then(r => {
                    return exec('git init');
                })
                .then(r => {
                    return exec('git add .');
                })
                .then(r => {
                    return exec('git commit -m "Initialize vuelab project"');
                })
                .then(r => {
                    console.log('vuelab initialization complete');
                    console.log('Now run the following commands to get started:');
                    console.log(`cd "${path}"`);
                    console.log('npm start');
                }, e => {
                    console.error('Error: vuelab initialization failed', e);
                })
            ;
        }
    }
    else if (command == 'create') {
        Array.prototype.splice.call(process.argv, 2, 1);
        require(Path.join(process.cwd(), 'bin/create'));
    }
    else {
        console.error('ERROR: Invalid command');
        usage();
        process.exit(1);
    }
}

function exec(command) {
    return new Promise((resolve, reject) => {
        console.log('Running:', command);
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                reject(error);
            }
            else {
                console.log(stdout);
                resolve();
            }
        });
    });
}

function usage() {
    console.log('vuelab v' + pkg.version);
    console.log('Available commands:');
    console.log('vuelab init {{PROJECT_DIRECTORY}}');
    console.log('vuelab create route {{URL}}');
    console.log('vuelab create component {{COMPONENT_NAME}} {{COMPONENT_PATH}}');
}

main(process.argv.slice(2));
