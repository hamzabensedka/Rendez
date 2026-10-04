import { deskStats, nextUp, queueWithout } from '../deskModel';
import type { ProviderAppointment } from '../../../application/query/hooks';

function apt(partial: Partial<ProviderAppointment> & Pick<ProviderAppointment, 'id' | 'status' | 'startAtUtc' | 'endAtUtc'>): ProviderAppointment {
  return { clientUser: null, staff: null, appointmentItems: [], ...partial };
}

const now = new Date('2026-09-04T13:00:00');

describe('deskModel', () => {
  const bookedLater = apt({
    id: '1',
    status: 'BOOKED',
    startAtUtc: '2026-09-04T14:30:00',
    endAtUtc: '2026-09-04T15:15:00',
  });
  const bookedLate = apt({
    id: '2',
    status: 'BOOKED',
    startAtUtc: '2026-09-04T11:00:00',
    endAtUtc: '2026-09-04T12:00:00',
  });
  const done = apt({
    id: '3',
    status: 'COMPLETED',
    startAtUtc: '2026-09-04T10:00:00',
    endAtUtc: '2026-09-04T11:00:00',
  });

  it('counts remaining, done, and late', () => {
    expect(deskStats([bookedLater, bookedLate, done], now)).toEqual({
      remaining: 1,
      done: 1,
      late: 1,
    });
  });

  it('picks the next still-open booking', () => {
    expect(nextUp([bookedLate, bookedLater, done], now)?.id).toBe('1');
  });

  it('drops the up-next id from the queue', () => {
    expect(queueWithout([bookedLater, done], '1').map((a) => a.id)).toEqual(['3']);
  });
});
