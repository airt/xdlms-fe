// 1. start the dev server using production config
process.env.PORT = '8070'
process.env.NODE_ENV = 'testing'
const spawn = require('cross-spawn')
const server = require('../../build/dev-server')

// 2. run the nightwatch test suite against it
// to run in additional browsers:
//    1. add an entry in test/e2e/nightwatch.conf.json under "test_settings"
//    2. add it to the --env flag below
// or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
// for more information on nightwatch's config file, see
// http://nightwatchjs.org/guide#settings-file
let opts = process.argv.slice(2)
if (!opts.includes('--config')) {
  opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])
}
if (!opts.includes('--env')) {
  opts = opts.concat(['--env', 'chrome'])
}

const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

runner.on('exit', (code) => {
  server.close()
  process.exit(code)
})

runner.on('error', (err) => {
  server.close()
  throw err
})
