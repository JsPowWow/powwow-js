export default {
  displayName: 'fun-chat-server',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/apps/vanilla/fun-chat/fun-chat-server',
  testMatch: ['!**/*.test.js', '**/*.spec.ts'], // disable tests
};
