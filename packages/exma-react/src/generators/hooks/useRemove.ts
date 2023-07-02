//types
import type { Project, Directory } from 'ts-morph';
//helpers
import Model from '../../types/Model';
import { getTypeName, formatCode } from '../../utils';

type Location = Project|Directory;

export default function generate(project: Location, name: string) {
  const model = new Model(name);
  const path = `model/${model.name}/hooks/useRemove.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { AxiosRequestConfig } from 'axios';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'axios',
    namedImports: [ 'AxiosRequestConfig' ]
  });
  //import type { ModelType } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ getTypeName(model) ]
  });
  //import { useFetch } from '../../../../hooks';
  source.addImportDeclaration({
    moduleSpecifier: '../../../../hooks',
    namedImports: [ 'useFetch' ]
  });
  //export default function useRemove(id: string, method: string, path: string, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useRemove',
    parameters: [
      { name: 'id', type: 'string' },
      { name: 'method', type: 'string' },
      { name: 'path', type: 'string' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: formatCode(`
      const action = useFetch<${getTypeName(model)}>(method, path, options);
      const handlers = {
        send() {
          if (action.status === 'fetching') return false;
          action.call({ params: { id } });
        }
      };
      return {
        handlers, 
        reset: action.reset,
        status: action.status,
        response: action.response
      };
    `)
  });
};