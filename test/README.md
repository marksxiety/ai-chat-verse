# Test Suite

This directory contains all test files organized by module.

## Structure

```
test/
├── setup.ts              # Global test setup (mocks, configurations)
├── server/
│   ├── services.test.js   # Tests for config loading and client creation
│   └── streamHandler.test.js  # Tests for SSE streaming logic
└── stores/
    ├── ModelProviderStore.test.ts    # Tests for provider/model state
    └── ChatHistoryStore.test.ts      # Tests for chat history management
```

## Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with visual interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

- **Server Tests (15 tests):**
  - Config loading and caching
  - OpenAI client creation
  - Provider message processing
  - SSE streaming implementation
  - Error handling

- **Store Tests (20 tests):**
  - ModelProviderStore (5 tests): Provider/model selection
  - ChatHistoryStore (15 tests): Chat CRUD, messages, sorting

## Test Files

Each test file includes:
- JSDoc comments describing what is being tested
- Arrangement, Action, Assertion (AAA) pattern
- Detailed test scenario explanations
- Mock dependencies for isolation
