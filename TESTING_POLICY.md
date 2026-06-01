# Testing Policy

This project follows a component-only testing strategy.
The goal is to validate real user behavior on Web Components through browser-based integration scenarios.

## 1) Test Layers

1. Component tests are the single source of test truth.
2. Unit tests are not part of the active test strategy.
3. End-to-end tests are optional and only added for critical flows when needed.

## 2) What Belongs to Component Tests

Write component tests when behavior depends on browser or component integration concerns:

- rendering and slot behavior
- keyboard and pointer interactions
- focus management
- accessibility attributes and error messaging
- custom element lifecycle and event dispatching
- validation behavior visible to users

## 3) Test Design Principles

Keep tests scenario-focused and small:

- each test should verify one observable behavior
- prefer short setup and explicit expectations
- avoid implementation-coupled assertions
- avoid snapshot-heavy tests for dynamic UI behavior

Realistic user interaction is preferred over testing private internals.

## 4) Placement and Naming

- Tests stay under src/tests in feature-oriented folders.
- Use \*.test.js naming consistently.

## 5) Quality Rules

1. Every bug fix should include at least one test that would fail before the fix.
2. Prefer public behavior coverage over internal method assertions.
3. Keep tests readable and intention-revealing.

## 6) Current Runner Scope

The Vitest browser configuration is the canonical runner for this repository.
All tests are expected to run from start to finish in one complete suite.

Policy intent: component-only, realistic, and maintainable.
