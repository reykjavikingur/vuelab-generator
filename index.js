const package = require('./package');
const Path = require('path');
const gnat = require('gnat');

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
            gnat.clone('https://github.com/reykjavikingur/vuelab.git', path)
                .then(r => {
                    console.log('Initialization complete');
                    process.exit(0);
                }, e => {
                    console.error('Initialization failed: ', e);
                    process.exit(1);
                })
            ;
        }
    }
    else if (command == 'create') {

    }
    else {
        console.error('ERROR: Invalid command');
        usage();
        process.exit(1);
    }
}

function usage() {
    console.log('vuelab v' + package.version);
    console.log('Available commands:');
    console.log('vuelab init {{PROJECT_DIRECTORY}}');
    console.log('vuelab create route {{URL}}');
    console.log('vuelab create component {{COMPONENT_NAME}} {{COMPONENT_PATH}}');
}

main(process.argv.slice(2));
