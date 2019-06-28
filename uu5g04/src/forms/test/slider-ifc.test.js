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
import "uu5g04-forms";
import enzymeToJson from 'enzyme-to-json';

describe('UU5.Forms.InputTextMixin interface test', () => {


  it('isInput()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
      />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getValue() should return default null', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={-300}
        max={300}
      />
    );
    expect(wrapper.instance().getValue()).toBe(0);
  });

  it('getValue() should return value', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={20}
      />
    );
    expect(wrapper.instance().getValue()).toBe(20);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getValue() value is empty. Should return empty string.', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={null}
      />
    );
    expect(wrapper.instance().getValue()).toBe(0);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setValue(value,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={10}
      />
    );
    expect(wrapper.instance().getValue()).toBe(10);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue(150, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toBe(150);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getMessage() should return null, second: shoudl return new mesage', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
      />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({message: "New Setting message"});
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it('setMessage(msg, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={null}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getMessage()).toBeNull();
    const returnValue = wrapper.instance().setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getFeedBack()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({feedback: "success"});
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('setFeedBack(feedback, message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={20}
        required={false}
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBe(20);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", 150, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).toBe(150);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('setInitial(msg, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={20}
        message={"This input is required"}
        feedback={"error"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getValue()).toBe(20);
    expect(wrapper.instance().getMessage()).toEqual("This input is required")
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", 0, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.instance().getMessage()).toEqual("Initial Message")
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isInitial()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={10}
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", 10, mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setLoading(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={10}
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getValue()).toBe(10);
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", 0, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().getValue()).toBe(0);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isLoading()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={-300}
        max={300}
        value={null}
        required={false}
      />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setSuccess(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={5}
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBe(5);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", 10, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(wrapper.instance().getValue()).toBe(10);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isSuccess() fisr return false, second return true', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={null}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", 10, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(wrapper.instance().getValue()).toBe(10);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('setWarning(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        min={0}
        max={300}
        value={0}
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBe(0);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", 0, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message")
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isWarning()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={null}
        required={true}
        feedback={"warning"}
        message={"Warning message"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", 10, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setError(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={0}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", -10, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().getValue()).toBe(-10);
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isError()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={0}
        required={true}
        feedback={"error"}
        message={"Error message"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", 10, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('reset(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", 100, mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        required={true}
      />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining({
      "feedback": "initial",
      "message": null,
      "value": 0
    }));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={0}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining({
      "feedback": "initial",
      "message": null,
      "value": 0
    }));
    const returnValue = wrapper.instance().setChangeFeedback({
      feedback: 'error',
      message: 'Error message from setChangeFeedback',
      value: 50
    }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toBe(50);
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.message).toEqual("Error message from setChangeFeedback");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isReadOnly()', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={null}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setEditableValue(true, setStateCallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(mockFunc).toBeCalled();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    const returnValue = wrapper.instance().setEditableValue(true, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it('setEditableValue(false, setStateCallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(mockFunc).toBeCalled();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    const returnValue = wrapper.instance().setEditableValue(false, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });


  it('readOnly(setStatecallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('editable(setStatecallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper.instance().state.readOnly).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().editable(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getLabel(idinput)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    expect(wrapper.instance().getLabel()).not.toBeNull();
    expect(wrapper.instance().getLabel()).not.toBeUndefined();
    expect(() => wrapper.instance().getLabel()).not.toThrow();
    expect(wrapper.instance().getLabel()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLabel()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });

  it('getInputWrapper(inpuid)', () => {
    const wrapper = shallow(
      <UU5.Forms.Slider
        label="Level of slide"
        id={"idTextArea"}
        value={100}
        required={true}
      />
    );
    expect(wrapper.instance().getInputWrapper()).not.toBeNull();
    expect(wrapper.instance().getInputWrapper()).not.toBeUndefined();
    expect(() => wrapper.instance().getInputWrapper()).not.toThrow();
    expect(wrapper.instance().getInputWrapper()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInputWrapper()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });


});
