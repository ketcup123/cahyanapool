import { describe, expect, it } from 'vitest';

import { getWhatsAppUrl } from '../src/services/contactService';

describe('getWhatsAppUrl', () => {
  it('does not fabricate a contact URL when the number is not configured', () => {
    expect(getWhatsAppUrl('main')).toBe('');
  });
});