import { getZoneName, AspectType, ZoneName, zoneAspectTypes } from './types';

describe('getZoneName', () => {
  // Test each AspectType
  Object.keys(zoneAspectTypes).forEach((zoneName) => {
    zoneAspectTypes[zoneName as ZoneName].forEach((aspectType) => {
      test(`should return ${zoneName} for ${aspectType}`, () => {
        expect(getZoneName(aspectType)).toBe(zoneName);
      });
    });
  });

  // Test an AspectType that doesn't exist
  test('should return undefined for an AspectType that doesn\'t exist', () => {
    expect(getZoneName('nonexistent' as AspectType)).toBeUndefined();
  });

  // Test an empty AspectType
  test('should return undefined for an empty AspectType', () => {
    expect(getZoneName('' as AspectType)).toBeUndefined();
  });
});