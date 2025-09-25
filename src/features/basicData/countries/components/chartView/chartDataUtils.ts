import { Country } from "../../types/Country";
import { getActiveStates, getStatesCount } from "../../utils/statesUtils";

export interface RegionData {
  name: string;
  value: number;
}

export interface CurrencyData {
  name: string;
  value: number;
}

export interface TimelineData {
  month: string;
  count: number;
  cumulative: number;
}

export interface StatesData {
  name: string;
  statesCount: number;
  totalStates: number;
}

export const prepareRegionData = (countries: Country[]): RegionData[] => {
  const regions: Record<string, number> = {};

  countries.forEach((country: Country) => {
    // Use the first letter of the country name as a simple grouping mechanism
    // This removes the hardcoded region mapping and makes it dynamic
    const firstLetter = country.nameEn?.charAt(0)?.toUpperCase() || 'Unknown';
    const region = `${firstLetter} Countries`;

    regions[region] = (regions[region] || 0) + 1;
  });

  return Object.entries(regions).map(([name, value]) => ({ name, value }));
};

export const prepareCurrencyData = (countries: Country[]): CurrencyData[] => {
  const currencies: Record<string, number> = {};

  countries.forEach((country) => {
    if (country.currencyCode) {
      currencies[country.currencyCode] = (currencies[country.currencyCode] || 0) + 1;
    }
  });

  return Object.entries(currencies)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 10); // Top 10 currencies
};

export const prepareTimelineData = (countries: Country[]): TimelineData[] => {
  const timeline: Record<string, number> = {};

  countries.forEach((country) => {
    if (country.createdOn) {
      const month = new Date(country.createdOn).toISOString().slice(0, 7); // YYYY-MM
      timeline[month] = (timeline[month] || 0) + 1;
    }
  });

  return Object.entries(timeline)
    .map(([month, count]) => ({ month, count: count as number, cumulative: 0 }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item, index, array) => ({
      ...item,
      cumulative: array.slice(0, index + 1).reduce((sum, curr) => sum + curr.count, 0),
    }));
};

export const prepareStatesData = (countries: Country[]): StatesData[] => {
  return countries
    .map((country) => ({
      name: country.nameEn || 'Unknown',
      statesCount: getStatesCount(country.states),
      totalStates: country.states?.length || 0,
    }))
    .filter((item) => item.statesCount > 0)
    .sort((a, b) => b.statesCount - a.statesCount)
    .slice(0, 10); // Top 10 countries with most states
};

// Utility function to calculate total states across all countries
export const getTotalStatesCount = (countries: Country[]): number => {
  return countries.reduce((total, country) => {
    return total + getStatesCount(country.states);
  }, 0);
};

// Utility function to get countries with states vs without states
export const getCountriesStatesDistribution = (countries: Country[]): {
  withStates: number;
  withoutStates: number;
} => {
  let withStates = 0;
  let withoutStates = 0;

  countries.forEach((country) => {
    if (getStatesCount(country.states) > 0) {
      withStates++;
    } else {
      withoutStates++;
    }
  });

  return { withStates, withoutStates };
};

import { COLOR_PALETTES } from '../../../../../shared/components/charts/chartUtils';

export const getChartColors = (): string[] => COLOR_PALETTES.rainbow;