/* @flow */
import * as groupedTokens from 'mineral-ui-tokens/groupedTokens';
import { black, brand, gray, white } from 'mineral-ui-tokens';
import createColorRamp from '../../../../library/themes/createColorRamp';
import fontSize_base from '../../../../library/themes/fontSizeBase';
import themeFromTokens from '../../../../library/themes/themeFromTokens';

type Ramp = { [string]: string };
type ThemeVariables = Array<{ [string]: Values | ((Ramp) => Values) }>;
type Values = { [string]: number | string };

const grayRamp = createColorRamp(gray, 'color_gray');

const getThemeRamp = (themeRamp?: Ramp) => {
  return themeRamp || createColorRamp(brand, 'color_theme');
};

// prettier-ignore
const themeVariables: ThemeVariables = [
  { generics: (themeRamp: Ramp) => ({
    ...themeFromTokens({ themeRamp, tokens: groupedTokens.generic }),
    fontSize_base
    })
  },
  { Headings: themeFromTokens({ themeRamp: undefined, tokens: groupedTokens.heading }) },
  { Icons: (themeRamp: Ramp) => themeFromTokens({ themeRamp, tokens: groupedTokens.icon }) },
  { Inputs: themeFromTokens({ themeRamp: undefined, tokens: groupedTokens.input }) },
  { Panels: themeFromTokens({ themeRamp: undefined, tokens: groupedTokens.panel }) },
  { Wells: themeFromTokens({ themeRamp: undefined, tokens: groupedTokens.well }) },
  {
    Colors: (themeRamp: Ramp) => ({
      ...getThemeRamp(themeRamp),
      color_white: white,
      ...grayRamp,
      color_black: black
    })
  }
];

export default themeVariables;
