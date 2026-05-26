# Contributing to Titan Grove

We welcome contributions to Titan Grove! This document provides guidelines for contributing to our modern Oracle EBS competitor.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- Basic understanding of TypeScript
- Familiarity with enterprise business applications

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/titan-grove.git
cd titan-grove

# Add upstream remote
git remote add upstream https://github.com/harborgrid-justin/titan-grove.git
```

## Development Setup

### Initial Setup

```bash
# Install dependencies
npm install --force

# Copy environment files
cp .env.example .env
cp .env.business.example .env.business

# Build the project
npm run build

# Run tests
npm test

# Start development server
npm run dev
```

### Development Workflow

1. **Create a branch** from `main` for your feature/fix
2. **Make changes** following our coding standards
3. **Add tests** for new functionality
4. **Run tests** and ensure they pass
5. **Commit changes** with descriptive messages
6. **Push to your fork** and create a pull request

```bash
# Create feature branch
git checkout -b feature/amazing-new-feature

# Make your changes
# ... code changes ...

# Add and commit
git add .
git commit -m "feat: add amazing new feature"

# Push to your fork
git push origin feature/amazing-new-feature
```

### AI-Assisted Development with Claude

Titan Grove is set up for **Claude** and **Claude Code** as the default coding
agents. Before using an AI agent on this repo:

- Read [`CLAUDE.md`](CLAUDE.md) — the project memory Claude loads every session
  (build/test commands, the Rust-native rebuild step, conventions).
- The [`docs/CLAUDE_BEST_PRACTICES.md`](docs/CLAUDE_BEST_PRACTICES.md) guide covers
  the enterprise playbook: specialized subagents in `.claude/agents/`, path-scoped
  rules in `.claude/rules/`, team permissions in `.claude/settings.json`, and how to
  maximize token usage while minimizing waste.
- Keep `CLAUDE.md` and `.claude/rules/` lean and accurate — they are checked into git
  and shared with the whole team. See the official guidance at
  https://code.claude.com/docs/en/best-practices.

## Contribution Guidelines

### Types of Contributions

We welcome these types of contributions:

- **Bug fixes**: Fix existing issues
- **Features**: Add new business functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize performance
- **Refactoring**: Improve code quality
- **Examples**: Add usage examples

### Business Logic Contributions

When contributing to business logic:

- Understand the business domain thoroughly
- Follow enterprise patterns and practices
- Ensure compatibility with Oracle EBS concepts
- Add comprehensive documentation
- Include real-world examples

### Architecture Guidelines

- Follow Domain-Driven Design principles
- Maintain separation of concerns
- Use dependency injection where appropriate
- Implement proper error handling
- Follow SOLID principles

## Code Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names
- Follow established naming conventions

```typescript
// Good example
interface PayrollCalculation {
  employeeId: string;
  grossPay: number;
  deductions: Deduction[];
  netPay: number;
}

async function calculatePayroll(
  employeeId: string,
  period: PayrollPeriod
): Promise<PayrollCalculation> {
  // Implementation
}

// Avoid
function calc(emp: any): any {
  // Implementation
}
```

### Naming Conventions

- **Classes**: `PascalCase` (`PayrollService`)
- **Functions/Variables**: `camelCase` (`calculateTax`)
- **Constants**: `UPPER_SNAKE_CASE` (`TAX_RATE`)
- **Files**: `kebab-case` (`payroll-service.ts`)
- **Directories**: `kebab-case` (`human-resources/`)

### Code Formatting

We use Prettier and ESLint for code formatting:

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint --fix
```

### Documentation Requirements

- Add JSDoc comments for all public functions and classes
- Document business logic and calculations
- Include examples for complex functionality
- Update README.md for new features

```typescript
/**
 * Calculate employee benefits deduction
 * 
 * @param employee - Employee information
 * @param benefits - Selected benefits package
 * @param payPeriod - Current pay period
 * @returns Calculated deduction amount
 * 
 * @example
 * ```typescript
 * const deduction = calculateBenefitsDeduction(
 *   employee,
 *   { health: true, dental: true },
 *   PayPeriod.MONTHLY
 * );
 * ```
 */
async function calculateBenefitsDeduction(
  employee: Employee,
  benefits: BenefitsPackage,
  payPeriod: PayPeriod
): Promise<number> {
  // Implementation
}
```

## Testing Requirements

### Test Coverage

- Minimum 80% test coverage for new code
- Unit tests for all business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows

### Test Structure

```bash
tests/
├── unit/           # Unit tests
│   ├── services/
│   ├── utils/
│   └── ...
├── integration/    # Integration tests
│   ├── api/
│   ├── database/
│   └── ...
└── e2e/           # End-to-end tests
    ├── workflows/
    └── ...
```

### Writing Tests

```typescript
// Unit test example
describe('TaxCalculationService', () => {
  let service: TaxCalculationService;

  beforeEach(() => {
    service = new TaxCalculationService();
  });

  describe('calculateIncomeTax', () => {
    it('should calculate tax for single filer', async () => {
      const result = await service.calculateIncomeTax({
        income: 50000,
        filingStatus: FilingStatus.SINGLE,
        state: 'CA'
      });

      expect(result.federalTax).toBeGreaterThan(0);
      expect(result.stateTax).toBeGreaterThan(0);
      expect(result.totalTax).toBe(result.federalTax + result.stateTax);
    });

    it('should handle zero income', async () => {
      const result = await service.calculateIncomeTax({
        income: 0,
        filingStatus: FilingStatus.SINGLE,
        state: 'CA'
      });

      expect(result.totalTax).toBe(0);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern="tax-calculation"

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Pull Request Process

### Before Submitting

1. Ensure your code follows our standards
2. All tests pass
3. Documentation is updated
4. Branch is up to date with main

```bash
# Update your branch
git fetch upstream
git rebase upstream/main

# Run final checks
npm run lint
npm test
npm run build
```

### Pull Request Template

When creating a pull request, include:

- **Description**: Clear description of changes
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How the changes were tested
- **Breaking Changes**: Any breaking changes
- **Related Issues**: Link to related issues

Example PR description:
```markdown
## Description
Adds comprehensive payroll calculation service with support for multi-state tax calculations.

## Type of Change
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- Added unit tests with 95% coverage
- Tested with sample data from CA, NY, TX
- Integration tests for API endpoints

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Tests added and passing
- [x] Documentation updated
```

### Review Process

1. **Automated checks**: CI/CD pipeline runs
2. **Code review**: Team members review code
3. **Testing**: Reviewer tests functionality
4. **Approval**: Approved by maintainers
5. **Merge**: Merged into main branch

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Environment**: OS, Node.js version, etc.
- **Steps to reproduce**: Detailed reproduction steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Additional context**: Any other relevant information

### Feature Requests

For feature requests, include:

- **Business case**: Why this feature is needed
- **Proposed solution**: How it should work
- **Alternatives**: Other solutions considered
- **Additional context**: Examples, mockups, etc.

### Security Issues

For security vulnerabilities:

- **Do not** create public issues
- Email security concerns privately
- Include steps to reproduce
- Provide potential impact assessment

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards others

### Communication

- Use clear, professional language
- Be patient with questions
- Provide helpful, actionable feedback
- Ask questions when unclear
- Share knowledge and resources

### Best Practices

- **Stay focused**: Keep discussions on-topic
- **Be constructive**: Offer solutions, not just criticism
- **Test thoroughly**: Test your own changes
- **Document well**: Help others understand your code
- **Follow up**: Respond to feedback and questions

## Getting Help

### Resources

- **Documentation**: Check `/docs` directory
- **Examples**: See `.development/demos`
- **API Reference**: Available in `/docs/api`
- **Troubleshooting**: See `/docs/TROUBLESHOOTING.md`

### Support Channels

- **GitHub Discussions**: Ask questions and discuss
- **Issues**: Report bugs and request features  
- **Discord/Slack**: Real-time community chat
- **Stack Overflow**: Tag with `titan-grove`

### Mentorship

New contributors can:

- Start with "good first issue" labels
- Ask for guidance in discussions
- Join community calls and meetings
- Pair program with experienced contributors

## Recognition

We appreciate all contributions! Contributors will be:

- Listed in CONTRIBUTORS.md
- Recognized in release notes
- Invited to contributor events
- Considered for maintainer roles

## License

By contributing to Titan Grove, you agree that your contributions will be licensed under the same MIT license that covers the project.

---

Thank you for contributing to Titan Grove! Your efforts help make enterprise software better for everyone.