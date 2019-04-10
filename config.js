var environments = {};

environments.staging = {
    'httpPort' : 3000,
    'httpsPort': 3001,
    'envName' : 'staging'
};

environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production'
};
// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : 'staging';

// Check that the current environment is one of the environments above
var envronmentToExport = typeof (environments[currentEnvironment]) === 'object' ?  environments[currentEnvironment] : environments.staging;

module.exports = envronmentToExport;