import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from './tsconfig.paths.json'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

export default jestConfig
