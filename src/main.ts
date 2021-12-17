import * as core from '@actions/core'
import {promises as fs} from 'fs'
import yaml from 'js-yaml'
import {OpenAPIObject} from 'openapi3-ts'
import {clean} from './clean'

async function run(): Promise<void> {
  try {
    const filePath: string = core.getInput('file')
    const file = await fs.readFile(filePath, 'utf8')

    let doc: OpenAPIObject | undefined
    const ext = file.split('.').pop()
    if (ext === 'json') {
      try {
        doc = JSON.parse(file)
      } catch (e) {
        return core.setFailed(`Unable to parse spec file with error: ${e}`)
      }
    } else {
      try {
        doc = yaml.load(file) as OpenAPIObject
      } catch (e) {
        return core.setFailed(`Unable to parse spec file with error: ${e}`)
      }
    }

    if (!doc) {
      return core.setFailed('Unable to parse spec file.')
    }

    const cleanedDoc = clean(doc)

    if (ext !== 'json') {
      await fs.writeFile(filePath, yaml.dump(cleanedDoc))
    } else {
      await fs.writeFile(filePath, JSON.stringify(cleanedDoc, null, 4))
    }
  } catch (error) {
    if (error instanceof Error) return core.setFailed(error.message)
    if (error instanceof String) return core.setFailed(error as string)
    core.setFailed(`Unable to perform cleanup due to unknown error: ${error}`)
  }
}

run()
