describe('Basic functionality', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have Node.js environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});