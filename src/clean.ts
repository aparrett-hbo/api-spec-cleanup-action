import {OpenAPIObject} from 'openapi3-ts'

export function clean(doc: OpenAPIObject): OpenAPIObject {
  doc.info.version = '2'
  return doc
}
