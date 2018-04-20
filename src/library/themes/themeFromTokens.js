/* @flow */
import pxToEm from '../styles/pxToEm';

type Args = { themeRamp?: Ramp, tokens: Tokens };
type Ramp = { [string]: string };
type Tokens = { [string]: number | string };

const contains = (string: string, subString: string) =>
  string.indexOf(subString) !== -1;

const remToEm = (value: string) => value.replace('rem', 'em');

const themeRampMap = {
  backgroundColor_brand_selected: 'color_theme_10',
  backgroundColor_brand_selectedActive: 'color_theme_30',
  backgroundColor_brand_selectedHover: 'color_theme_20',
  backgroundColor_brandPrimary: 'color_theme_60',
  backgroundColor_brandPrimary_active: 'color_theme_70',
  backgroundColor_brandPrimary_focus: 'color_theme_60',
  backgroundColor_brandPrimary_hover: 'color_theme_50',
  borderColor_brand: 'color_theme_60',
  borderColor_brand_active: 'color_theme_70',
  borderColor_brand_focus: 'color_theme_70',
  borderColor_brand_hover: 'color_theme_50',
  color_brand: 'color_theme_60',
  color_brand_active: 'color_theme_70',
  color_brand_focus: 'color_theme_60',
  color_brand_hover: 'color_theme_50',
  icon_color_brand: 'color_theme_60'
};

// [1] TODO: Despite `isStringValue` check, Flow thinks tokens[key] could be a number
export default function themeFromTokens({ themeRamp, tokens }: Args): Tokens {
  return Object.keys(tokens).reduce((acc, key) => {
    const isStringValue = typeof tokens[key] === 'string';
    const isPixelValue =
      isStringValue &&
      // $FlowFixMe: [1]
      contains(tokens[key], 'px') &&
      // $FlowFixMe: [1]
      tokens[key].split('px').length === 2;

    if (contains(key, 'brand')) {
      const themeKey = key.replace('brand', 'theme');
      acc[themeKey] =
        (themeRamp && themeRamp[themeRampMap[key]]) || tokens[key];
      // $FlowFixMe: [1]
    } else if (isStringValue && contains(key, 'fontSize')) {
      // $FlowFixMe: [1]
      acc[key] = remToEm(tokens[key]);
    } else if (isPixelValue && !contains(key, 'breakpoint')) {
      acc[key] = pxToEm(tokens[key]);
    } else {
      acc[key] = tokens[key];
    }
    return acc;
  }, {});
}
