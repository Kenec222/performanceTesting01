/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";

const TagName = "UU5.Bricks.Camera";

describe(`${TagName} interface testing`, () => {

  it('getScreenShot()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Camera
        id={"uuID-camera"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(typeof wrapper.instance().getScreenShot).toBe("function");
    expect(() => wrapper.instance().getScreenShot()).not.toThrow();
  });

});