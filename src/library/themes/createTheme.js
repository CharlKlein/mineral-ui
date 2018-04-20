/* @flow */
import tokens, {
  black,
  brand,
  gray,
  white
} from 'mineral-ui-tokens';
import palette from '../colors';
import createColorRamp from './createColorRamp';
import fontSize_base from './fontSizeBase';
import themeFromTokens from './themeFromTokens';

type Colors =
  | 'blue'
  | 'bronze'
  | 'dusk'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'magenta'
  | 'purple'
  | 'red'
  | 'sky'
  | 'slate'
  | 'teal';
type Ramp = { [string]: string };

const defaultBaseColor = 'blue';

const grayRamp = createColorRamp(gray, 'color_gray');

const getThemeRamp = (themeRamp?: Ramp) => {
  return themeRamp || createColorRamp(brand, 'color_theme');
};

export default function createTheme(
  baseColor?: Colors = defaultBaseColor,
  overrides?: { [string]: any } = {}
): { [string]: any } {
  let themeRamp;
  if (baseColor !== defaultBaseColor) {
    themeRamp = createColorRamp(palette, 'color_theme', baseColor);
  }

  return {
    ...themeFromTokens({ themeRamp, tokens }),
    fontSize_base,
    ...getThemeRamp(themeRamp),
    color_white: white,
    ...grayRamp,
    color_black: black,
    ...overrides
  };
}
