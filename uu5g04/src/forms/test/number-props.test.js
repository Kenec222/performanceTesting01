/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MixinPropsFunction = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState: () => {
    return {
      isCalled: false,
      value: "",
      message: "",
      feedback: "initial",
    };
  },

  onFocusHandler(event) {
    alert("onFocus event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onBlurHandler(event) {
    alert("onBlur event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onEnterHandler(event) {
    alert("onEnter event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  validateOnChangeHandler(event) {
    alert("ValidateOnChange event has been called.");
    this.setState({ isCalled: true });
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  render() {
    return (
      <UU5.Forms.Number
        id={"checkID"}
        label="Enter number"
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onEnter={this.onEnterHandler}
        validateOnChange={true}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
      />
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.TextInputMixin",
    "UU5.Forms.InputMixin",
    "UU5.Common.ColorSchemaMixin",
  ],
  props: {
    value: {
      values: [10, "10"],
    },
    step: {
      values: [2],
    },
    min: {
      values: [42],
    },
    max: {
      values: [665],
    },
    decimals: {
      values: [5],
    },
    decimalSeparator: {
      values: ["."],
    },
    thousandSeparator: {
      values: [","],
    },
    rounded: {
      values: [true, false],
    },
    nanMessage: {
      values: [null],
    },
    lowerMessage: {
      values: [null],
    },
    upperMessage: {
      values: [null],
    },
    buttonHidden: {
      values: [true, false],
    },
    decimalsView: {
      values: [2, 5],
    },
    decimalsViewRounded: {
      values: ["floor", "round", "ceil"],
    },
    prefix: {
      values: ["$", "hodnota"],
    },
    suffix: {
      values: ["kč", "cm"],
    },
    hideSuffixOnFocus: {
      values: [true, false],
    },
    hidePrefixOnFocus: {
      values: [true, false],
    },
    valueType: {
      values: ["string", "number"],
    },
    // NOTE Skipping because controlled/value doesn't work properly with each other and there's
    // hard to estimate how to change it without breaking compatibility (<ItemList gets as a value
    // "" at the beginning and then null after changing prop from value A => B => A).
    controlled: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
  },
  requiredProps: {
    controlled: false,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const valueTypeFn = (props) => {
  let onChangeFn = jest.fn((opt) => opt.component.onChangeDefault(opt));
  let onFocusFn = jest.fn((opt) => opt.component.onFocusDefault(opt));
  let onBlurFn = jest.fn((opt) => opt.component.onBlurDefault(opt));
  let onValidateFn = jest.fn((opt) => ({ value: opt.value }));
  const wrapper = mount(
    <UU5.Forms.Number
      valueType="number"
      onChange={onChangeFn}
      onFocus={onFocusFn}
      onBlur={onBlurFn}
      onValidate={onValidateFn}
      {...props}
    />
  );
  wrapper.find("input").simulate("change", { target: { value: "100000,5" } });
  wrapper.find("input").simulate("focus");
  wrapper.find("input").simulate("blur");
  expect(onChangeFn).toHaveBeenCalled();
  expect(onChangeFn.mock.calls[0][0].value).toBe(100000.5);
  expect(onFocusFn).toHaveBeenCalled();
  expect(onFocusFn.mock.calls[0][0].value).toBe(100000.5);
  expect(onBlurFn).toHaveBeenCalled();
  expect(onBlurFn.mock.calls[0][0].value).toBe(100000.5);
  expect(onValidateFn).toHaveBeenCalled();
  expect(onValidateFn.mock.calls[1][0].value).toBe(100000.5);

  expect(wrapper.instance().getValue()).toBe(100000.5);
};

describe(`UU5.Forms.Number props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Number, CONFIG);

  it('valueType="number"', () => {
    valueTypeFn();
    valueTypeFn({
      prefix: "prefix",
      suffix: "suffix",
      thousandSeparator: " ",
      decimalSeparator: ",",
      decimals: 6,
      decimalsView: 4,
      decimalsViewRounded: "round",
    });
  });
});

describe(`UU5.Forms.Number props function -> InputMixin`, () => {
  it("onChange()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("change", { target: { value: "10" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/10/);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.Number />);
    wrapper.instance().onChangeDefault({ _data: { type: "increase" } }, callback);
    expect(callback).toBeCalled();
  });

  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("validate", { target: { value: "10" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onValidate event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/10/);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("changeFeedback", { target: { value: "10" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChangeFeedback event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toMatch(/10/);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Number props function -> Text.InputMixin`, () => {
  it("onFocus()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("focus", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onFocus event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onFocus event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onBlur()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("blur", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onBlur event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onBlur event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onEnter()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toEqual("initial");
    wrapper.simulate("enter", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onEnter event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onEnter event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * You can not simulate events that do not start with it on. For example, onChange, onChangeFeedback.
   * Therefore, the validateonChange event is simulated here so that it is set to true, and event onValidate sets the message and feedback to error,
   * success if the component is valid. Valid component means that it is not empty and has the correct format.
   */

  it("validateOnChange() - input is invalid", () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"uuID"}
        label="Full name"
        validateOnChange={true}
        onValidate={(opt) => {
          let feedback;
          if (opt.value) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Not valid.");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.value).toBe("");
    expect(wrapper).toMatchSnapshot();
  });

  it("validateOnChange() - input is valid", () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"uuID"}
        value={10}
        label="Full name"
        validateOnChange={true}
        onValidate={(opt) => {
          let feedback;
          if (opt.value !== null) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.value).toEqual("10");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Number default props check`, () => {
  it(`UU5.Forms.Number daf props values`, () => {
    const wrapper = shallow(<UU5.Forms.Number id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();

    expect(wrapper.instance().props.value).toBe(null);
    expect(wrapper.instance().props.step).toBe(1);
    expect(wrapper.instance().props.min).toBe(null);
    expect(wrapper.instance().props.max).toBe(null);
    expect(wrapper.instance().props.decimals).toBe(null);
    expect(wrapper.instance().props.decimalSeparator).toBe(",");
    expect(wrapper.instance().props.thousandSeparator).toBe("");
    expect(wrapper.instance().props.rounded).toBeFalsy();
    expect(wrapper.instance().props.nanMessage).toBe(null);
    expect(wrapper.instance().props.lowerMessage).toBe(null);
    expect(wrapper.instance().props.upperMessage).toBe(null);
    expect(wrapper.instance().props.buttonHidden).toBeFalsy();
    expect(wrapper.instance().props.decimalsView).toBe(undefined);
    expect(wrapper.instance().props.decimalsViewRounded).toBe("floor");
    expect(wrapper.instance().props.prefix).toBe(undefined);
    expect(wrapper.instance().props.suffix).toBe(undefined);
    expect(wrapper.instance().props.hidePrefixOnFocus).toBe(false);
    expect(wrapper.instance().props.hideSuffixOnFocus).toBe(false);
  });
});

describe(`UU5.Forms.Number check default default props from Mixins`, () => {
  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.Number id={"uuID"} />);
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    //onChangeFeedback is not defined console.log(wrapper.instance().props);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toMatchObject({ xs: 12, s: 7 });
    expect(wrapper.instance().props.labelColWidth).toMatchObject({ xs: 12, s: 5 });
  });

  it(`UU5.Forms.TextInputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.Number id={"uuID"} />);
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.focusMessage).toBe(null);
    expect(wrapper.instance().props.patternMessage).toBe(null);
    expect(wrapper.instance().props.autocompleteItems).toBe(null);
    expect(wrapper.instance().props.onFocus).toBe(null);
    expect(wrapper.instance().props.onBlur).toBe(null);
    expect(wrapper.instance().props.onEnter).toBe(null);
    //validateOnChange is type function and should have null default value.
    expect(wrapper.instance().props.validateOnChange).toBeFalsy();
  });

  it(`UU5.Commons. Elementary, Base, Pure`, () => {
    const wrapper = shallow(<UU5.Forms.Number id={"uuID"} />);
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy();
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("uuID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
  });
});
