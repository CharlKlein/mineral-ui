/* @flow */
import tokens from 'mineral-ui-tokens';

// Token has rem units, but our theme variable needs to be in "px"
// Components are built on an 8px grid
export default `${tokens.fontSize_base.replace('rem', '') * 16}px`;
