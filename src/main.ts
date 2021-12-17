import * as core from '@actions/core'
import {promises} from 'fs'
// import yaml from 'js-yaml'

async function run(): Promise<void> {
  try {
    const filePath: string = core.getInput('file')
    const file = await promises.readFile(filePath, 'utf8')

    let spec
    try {
      spec = JSON.parse(file)
    } catch (e) {
      //   spec = yaml.load(file)
    }
    core.warning(spec.test)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
