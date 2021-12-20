import {clean} from '../../src/clean'
import * as defaultAPIDoc from '../defaultAPIDoc.json'
import {cloneDeep, set} from 'lodash'
import {OpenAPIV3} from 'openapi-types'
import Document = OpenAPIV3.Document
describe('clean', () => {
    it('should run', () => {
        expect(clean(defaultAPIDoc)).toEqual(defaultAPIDoc)
    })

    it('should convert boolean enums to booleans', () => {
        const doc = cloneDeep(defaultAPIDoc as Document)
        const param = {
            name: 'queryParam',
            in: 'query',
            description: '',
            required: true,
            example: 'true',
            schema: {
                type: 'string',
                enum: ['true', 'false']
            }
        }
        set(doc, 'paths./resource.get.parameters[0]', param)

        const expected = cloneDeep(defaultAPIDoc as Document)
        set(expected, 'paths./resource.get.parameters[0]', {
            ...param,
            example: true,
            schema: {
                type: 'boolean'
            }
        })
        expect(clean(doc)).toEqual(expected)
    })

    it('should move requestBody schema bodies up one level', () => {
        const doc = cloneDeep(defaultAPIDoc as Document)
        const schema = {
            body: {
                title: 'Post /resource',
                properties: {
                    resourceId: {
                        type: 'string',
                        minLength: 1
                    }
                }
            }
        }
       
        
        set(doc, 'paths./resource.post.requestBody.content.application/json.schema', schema)

        const expected = cloneDeep(defaultAPIDoc as Document)
        set(expected, 'paths./resource.post.requestBody.content.application/json.schema', schema.body)
        expect(clean(doc)).toEqual(expected)
    })
})
