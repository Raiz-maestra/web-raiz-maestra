import assert from 'node:assert/strict';
import test from 'node:test';
import { readAuthReturn, validatePassword } from './auth-link.ts';

test('forwards only complete auth tokens to the fixed native route', () => {
  const link = readAuthReturn('https://example.test/auth-callback#access_token=a&refresh_token=b&type=signup&redirect_to=https://evil.test');
  assert.equal(link.invalid, false);
  assert.equal(link.nativeUrl, 'raizmaestra://auth-callback#access_token=a&refresh_token=b&type=signup');
  assert.equal(link.nativeUrl.includes('evil'), false);
});

test('recognizes recovery on either web route and preserves PKCE codes', () => {
  assert.equal(readAuthReturn('https://example.test/auth-callback#access_token=a&refresh_token=b&type=recovery').recovery, true);
  assert.equal(readAuthReturn('https://example.test/reset-password?code=abc').nativeUrl, 'raizmaestra://reset-password#code=abc&type=recovery');
});

test('rejects missing, partial and error links without forwarding tokens', () => {
  for (const suffix of ['', '#access_token=a', '#access_token=a&refresh_token=b&error=access_denied', '?error_code=otp_expired&code=abc']) {
    const link = readAuthReturn(`https://example.test/auth-callback${suffix}`);
    assert.equal(link.invalid, true);
    assert.equal(link.nativeUrl, 'raizmaestra://auth-callback');
  }
});

test('password validation matches the app and requires confirmation', () => {
  for (const password of ['Short1', 'lowercase1', 'Nonumeric']) assert.ok(validatePassword(password, password));
  assert.ok(validatePassword('Password1', 'Different1'));
  assert.equal(validatePassword('Password1', 'Password1'), null);
});
