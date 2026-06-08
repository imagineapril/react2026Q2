import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../useFormStore';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
  });

  it('adds submission with id and timestamp', () => {
    const { addSubmission } = useFormStore.getState();
    const testData = {
      name: 'Test',
      age: 30,
      email: 'test@test.com',
      gender: 'male' as const,
      terms: true,
      password: 'pass',
      country: 'Россия',
      avatar: '',
    };
    addSubmission(testData);

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0]).toMatchObject(testData);
    expect(state.submissions[0].id).toBeDefined();
    expect(state.submissions[0].submittedAt).toBeTypeOf('number');
  });

  it('clears submissions', () => {
    const { addSubmission, clearSubmissions } = useFormStore.getState();
    addSubmission({
      name: 'Test',
      age: 30,
      email: 'test@test.com',
      gender: 'male',
      terms: true,
      password: 'pass',
      country: 'Россия',
      avatar: '',
    });
    expect(useFormStore.getState().submissions).toHaveLength(1);
    clearSubmissions();
    expect(useFormStore.getState().submissions).toHaveLength(0);
  });
});