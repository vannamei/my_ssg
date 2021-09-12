export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  roots: ['<rootDir>/tests/'],
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
};
