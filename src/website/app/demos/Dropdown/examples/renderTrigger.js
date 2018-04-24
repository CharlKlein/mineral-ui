/* @flow */

import { createStyledComponent } from '../../../../../library/styles';
import { Target } from 'react-popper';
import Dropdown from '../../../../../library/Dropdown';
import data from '../../Menu/components/menuData';

export default {
  id: 'render-trigger',
  title: 'Custom Rendering - renderTrigger',
  description: `Use the \`renderTrigger\`
[render prop](https://reactjs.org/docs/render-props.html) to provide custom
rendering control of the trigger.

_Prior to reaching for this functionality, please consider whether the
desired outcome could be achieved using a simpler means, such as with
Mineral's robust [styling](/styling) and/or [theming](/theming) capabilities._`,
  scope: {
    createStyledComponent,
    data,
    Dropdown,
    Target
  },
  source: `
    () => {
      // Your root element must be a Popper Target component.
      // import { Target } from 'react-popper';
      const CustomTrigger = createStyledComponent(Target, {});

      const renderTrigger = ({ triggerProps, isOpen }) => {
        const customTriggerProps = {
          ...triggerProps,
          component: 'button',
          role: undefined
        };

        return (
          <CustomTrigger {...customTriggerProps}>
            Menu <span role="img" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
          </CustomTrigger>
        );
      };

      return (
        <Dropdown data={data} renderTrigger={renderTrigger} />
      );
    }`
};
