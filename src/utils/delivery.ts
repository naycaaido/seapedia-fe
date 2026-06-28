import type { DeliveryMethod } from '../types';

export function getDeliveryMethodLabel(method: DeliveryMethod): string {
  switch (method) {
    case 'INSTANT':
      return 'Instant';
    case 'NEXT_DAY':
      return 'Next Day';
    case 'REGULAR':
      return 'Regular';
  }
}

export function getDeliverySlaHours(method: DeliveryMethod): number {
  switch (method) {
    case 'INSTANT':
      return 6;
    case 'NEXT_DAY':
      return 24;
    case 'REGULAR':
      return 72;
  }
}

export function getDeliverySlaLabel(method: DeliveryMethod): string {
  return `${getDeliveryMethodLabel(method)} • ${getDeliverySlaHours(method)}-hour SLA`;
}
