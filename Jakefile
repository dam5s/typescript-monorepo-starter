let {namespace, task} = require('jake');

namespace('backend', () => require('./backend/Jakefile'));
namespace('frontend', () => require('./frontend/Jakefile'));
namespace('deployments', () => require('./deployments/Jakefile'));
namespace('db', () => require('./database/Jakefile'));

task('build', ['backend:build', 'frontend:build']);
task('default', ['build']);
