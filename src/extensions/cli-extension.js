
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = toolbox => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension')
  }

  toolbox.htmlGenerate = () => {
    
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "grao" property),
  // grao.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "grao")
  // }
}
