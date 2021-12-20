import {OpenAPIV3} from 'openapi-types'
import {isPseudoBool} from './util'
import Document = OpenAPIV3.Document
import SchemaObject = OpenAPIV3.SchemaObject
import HttpMethods = OpenAPIV3.HttpMethods
import OperationObject = OpenAPIV3.OperationObject
import RequestBodyObject = OpenAPIV3.RequestBodyObject

export function clean(doc: Document): Document {
    for (const path of Object.keys(doc.paths)) {
        const pathsItemObject = doc.paths[path]
        for (const method of Object.keys(pathsItemObject as {})) {
            if (!Object.values<string>(HttpMethods).includes(method)) {
                continue
            }
            const operationObject: OperationObject | undefined = pathsItemObject?.[method as HttpMethods]

            if (!operationObject || !operationObject.parameters) {
                continue
            }

            for (const parameter of operationObject.parameters) {
                if (isPseudoBool(parameter)) {
                    if ('schema' in parameter && parameter.schema) {
                        ;(parameter.schema as SchemaObject).type = 'boolean'
                        parameter.example = true
                        delete (parameter.schema as SchemaObject).enum
                    }
                }
            }

            const requestBody = operationObject?.requestBody as RequestBodyObject | undefined
            if (requestBody?.content) {
                const mediaKeys = Object.keys(requestBody.content)
                for (const media of mediaKeys) {
                    const mediaObjectSchema = requestBody.content?.[media]?.schema as {[x: string]: any}
                    if (mediaObjectSchema?.body) {
                        requestBody.content[media].schema = mediaObjectSchema.body
                    }
                }
            }
        }
    }
    return doc
}
