import {isEqual} from 'lodash'
import {OpenAPIV3} from 'openapi-types'
import ParameterObject = OpenAPIV3.ParameterObject
import ReferenceObject = OpenAPIV3.ReferenceObject
import SchemaObject = OpenAPIV3.SchemaObject

export function isPseudoBool(
    param: ParameterObject | ReferenceObject
): boolean {
    if ('schema' in param) {
        const schema = param.schema as SchemaObject
        return (
            schema?.type === 'string' &&
            isEqual(schema?.enum?.sort(), ['false', 'true'])
        )
    }
    return false
}
