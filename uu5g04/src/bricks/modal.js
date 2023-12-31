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
import UU5, { createComponent } from "uu5g04";
import ns from "./bricks-ns.js";

import Header from "./modal-header.js";
import Body from "./modal-body.js";
import Footer from "./modal-footer.js";
import Css from "./internal/css.js";
import { enableBodyScrolling, disableBodyScrolling } from "./internal/page-utils.js";
import { RenderIntoPortal } from "./internal/portal.js";
import OptionalLibraries from "./internal/optional-libraries.js";

import "./modal.less";
//@@viewOff:imports

const MARGIN_SMALL = 4;
const MARGIN_NORMAL = 16;

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstOpen: "onFirstOpen",
  onEachOpen: "onEachOpen",
};

const getMountContent = (props = {}, state = {}) => {
  let mountContent = state.mountContent || props.mountContent;
  return mountContent === undefined
    ? props.location
      ? MOUNT_CONTENT_VALUES.onEachOpen
      : MOUNT_CONTENT_VALUES.onFirstRender // backward comaptibility
    : mountContent;
};

/**
 * Helper component for CSS animation - whenever prop "renderKey" changes, children
 * gets re-rendered twice. First render should typically render full content with visibility: hidden,
 * 2nd render should make it visible and apply CSS transition.
 */
const DoubleRender = createComponent({
  getInitialState() {
    let { doubleRenderOnMount, renderKey } = this.props;
    return { prevRenderKey: doubleRenderOnMount ? renderKey + "x" : renderKey };
  },
  componentDidMount() {
    let { doubleRenderOnMount } = this.props;
    if (doubleRenderOnMount) this._reRender();
  },
  componentDidUpdate(prevProps) {
    if (prevProps.renderKey !== this.props.renderKey) this._reRender();
  },
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.renderKey !== this.props.renderKey) this.setState({ prevRenderKey: nextProps.renderKey + "x" });
  },
  _reRender() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      delete this._rafId;
      this.setState({ prevRenderKey: this.props.renderKey });
    });
  },
  componentWillUnmount() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  },
  render() {
    let { renderKey, children } = this.props;
    let { prevRenderKey } = this.state;
    return children(renderKey !== prevRenderKey ? DoubleRender.FIRST_RENDER : DoubleRender.SECOND_RENDER);
  },
});
DoubleRender.FIRST_RENDER = 0;
DoubleRender.SECOND_RENDER = 1;

let openedModalStack = [];

const STATICS = {
  defaults: {
    header: "noHeader",
    body: "noBody",
    animationDuration: 150, // ms
    closeTypes: {
      closedButton: "closedButton",
      blur: "blur",
      ifc: "interface",
    },
  },
  opt: {
    nestingLevelRoot: true,
  },
};
const _Modal = UU5.Common.VisualComponent.create({
  displayName: "Modal", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrReaderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Modal"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: (props) => {
        let className = ns.css("modal");
        if (props.offsetTop === "auto") {
          className +=
            " " +
            Css.css(`
            && {
              display: flex !important;
              flex-direction: column;
              justify-content: center;
            }
          `);
        }
        return className;
      },
      dialog: (props) => {
        let className = ns.css("modal-dialog");

        if (typeof props.offsetTop === "number") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: ${props.offsetTop}px;
            }
          `);
        } else if (props.offsetTop === "auto") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: 0;
              margin-bottom: 0;
            }
          `);
        } else if (typeof props.offsetTop === "string") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: ${props.offsetTop};
            }
          `);
        }
        return className;
      },
      modalBusViewContent: (props) => {
        let styles = `
          margin: ${MARGIN_SMALL}px;
          max-height: calc(100% - ${MARGIN_SMALL * 2}px);

          .uu5-bricks-modal-layout-wrapper {
            margin: 0;
            display: flex;
            flex-direction: column;
          }

          &.uu5-bricks-modal-max {
            margin-left: 0px;
            margin-right: 0px;
            width: 100%;

            .uu5-bricks-modal-layout-wrapper {
              width: 100%;
            }
          }
        `;

        styles += UU5.Utils.ScreenSize.getMediaQueries(
          "xs",
          `
            &.uu5-bricks-modal-s, &.uu5-bricks-modal-m, &.uu5-bricks-modal-l {
              width: calc(100% - ${MARGIN_SMALL * 2}px);
            }
          `
        );

        styles += UU5.Utils.ScreenSize.getMinMediaQueries(
          "s",
          `
            margin: ${MARGIN_NORMAL}px;
            max-height: calc(100% - ${MARGIN_NORMAL * 2}px);
          `
        );

        styles += UU5.Utils.ScreenSize.getMediaQueries(
          "s",
          `
            &.uu5-bricks-modal-m, &.uu5-bricks-modal-l {
              width: calc(100% - ${MARGIN_NORMAL * 2}px);
              margin: ${MARGIN_NORMAL}px;
              max-height: calc(100% - ${MARGIN_NORMAL * 2}px);

              .uu5-bricks-modal-layout-wrapper {
                width: 100%;
              }
            }
          `
        );

        styles += UU5.Utils.ScreenSize.getMediaQueries(
          "m",
          `
            &.uu5-bricks-modal-l {
              width: calc(100% - ${MARGIN_NORMAL * 2}px);
              margin: ${MARGIN_NORMAL}px;
              max-height: calc(100% - ${MARGIN_NORMAL * 2}px);

              .uu5-bricks-modal-layout-wrapper {
                width: 100%;
              }
            }
          `
        );

        if (props.overflow) {
          styles += `
            && {
              max-height: none;
            }
          `;
        }

        if (styles) {
          return Css.css`${styles}`;
        }
      },
      fullscreen: () => {
        return Css.css({ width: "100%", height: "100%", margin: 0, maxHeight: "none" });
      },
      modalSize: ns.css("modal-"),
      isFooter: ns.css("modal-isfooter"),
      overflow: ns.css("modal-overflow"),
      bodyOverflow: ns.css("modal-body-overflow"),
      layoutWrapper: ns.css("modal-layout-wrapper"),
    },
    ...STATICS,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m", "l", "auto", "max"]),
    shown: UU5.PropTypes.bool,
    sticky: UU5.PropTypes.bool,
    stickyBackground: UU5.PropTypes.bool,
    scrollableBackground: UU5.PropTypes.bool,
    forceRender: UU5.PropTypes.bool,
    onClose: UU5.PropTypes.func,
    overflow: UU5.PropTypes.bool,
    mountContent: UU5.PropTypes.oneOf([
      MOUNT_CONTENT_VALUES.onEachOpen,
      MOUNT_CONTENT_VALUES.onFirstOpen,
      MOUNT_CONTENT_VALUES.onFirstRender,
    ]),
    offsetTop: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    location: UU5.PropTypes.oneOf(["local", "portal"]),
    registerToModalBus: UU5.PropTypes.bool,
    fullscreen: UU5.PropTypes.bool,

    _render: UU5.PropTypes.func,
    _allowClose: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      shown: false,
      sticky: false,
      stickyBackground: true,
      scrollableBackground: false,
      forceRender: false,
      onClose: null,
      overflow: false,
      mountContent: undefined,
      offsetTop: null,
      location: undefined,
      registerToModalBus: true,
      fullscreen: false,
      _render: undefined,
      _allowClose: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._closeCallbacks = [];
    this._openCounter = 0;

    let renderContent = getMountContent(this.props) === MOUNT_CONTENT_VALUES.onFirstRender || this.props.shown;

    return {
      header: renderContent ? this.getHeader() : null,
      content: renderContent ? this.getContent() || this.props.children : null,
      footer: renderContent ? this.getFooter() : null,
      className: null,
      size: this.props.size,
      sticky: this.props.sticky,
      stickyBackground: this.props.stickyBackground,
      scrollableBackground: this.props.scrollableBackground,
      onClose: this.props.onClose,
      overflow: this.props.overflow,
      openKey: this.props.shown ? this._openCounter++ : undefined,
      registerToModalBus: this.props.registerToModalBus,
      fullscreen: this.props.fullscreen,
    };
  },

  UNSAFE_componentWillMount() {
    this.setState({ hidden: !this.props.shown });
  },

  componentDidMount() {
    if (this._shouldOpenPageModal() && this.props.shown) {
      this.open();
    }
    UU5.Environment.EventListener.addWindowEvent("keydown", "uu5-bricks-modal-stack", _Modal._onCloseESC);
    this._updateAfterCommit(true);
  },

  componentDidUpdate(prevProps, prevState) {
    this._updateAfterCommit(prevState.hidden);
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState((state) => {
        let newState = {};

        if (nextProps.shown && state.hidden) {
          newState.hidden = false;
        } else if (!nextProps.shown && !state.hidden) {
          newState.hidden = true;
        }

        newState.header = nextProps.header;
        newState.footer = nextProps.footer;
        newState.content = nextProps.content || nextProps.children || state.content;
        newState.size = nextProps.size;
        newState.sticky = nextProps.sticky;
        newState.stickyBackground = nextProps.stickyBackground;
        newState.scrollableBackground = nextProps.scrollableBackground;
        newState.onClose = nextProps.onClose;

        // NOTE Condition should be more like "state.hidden && newState.hidden === false" but
        // it doesn't work because we're "controlled" therefore ElementaryMixin already updated
        // state.hidden to be nextProps.hidden (and if someone uses "shown" then they don't care
        // about "hidden", i.e. they keep it default, which is "false" and therefore state.hidden
        // is "false").
        if (state.openKey == null && !(newState.hidden ?? state.hidden)) newState.openKey = this._openCounter++;

        return newState;
      });
    }
  },

  componentWillUnmount() {
    // close page modal if local modal is unmounting
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      centralModal.close({ shouldOnClose: false, _referrer: this });
    }

    enableBodyScrolling("modal-" + this.getId(), true);

    openedModalStack = openedModalStack.filter((it) => it !== this);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isModal() {
    return true;
  },

  open(openProps, setStateCallback) {
    openProps = openProps || {};
    let _referrer = openProps._referrer;
    this._openProps = openProps;
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      let newProps = UU5.Common.Tools.merge(this.props, openProps, { _referrer: this });
      centralModal.open(newProps, setStateCallback);
    } else {
      let newState = this._getOpenProps(openProps);

      newState.hidden = newState.hidden || false;
      newState._referrer = _referrer;
      newState.renderContent = true;
      newState.openKey = this._openCounter++;

      this.setState(newState, setStateCallback);
    }
    return this;
  },

  isOpen() {
    let result;
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      result = centralModal.isOpen();
    } else {
      result = !this.isHidden();
    }
    return result;
  },

  close(shouldOnClose = true, setStateCallback) {
    return this._doClose(shouldOnClose, this.getDefault().closeTypes.ifc, setStateCallback);
  },

  toggle(setStateCallback) {
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      if (centralModal.isHidden()) {
        let openProps = this._getOpenProps(this._openProps);
        centralModal.open(openProps, setStateCallback);
      } else {
        centralModal.close(true, setStateCallback);
      }
    } else {
      if (this.state.hidden) {
        this.setState({ hidden: false }, setStateCallback);
      } else {
        this._close(setStateCallback);
      }
    }

    return this;
  },

  isSticky() {
    return this.state.sticky;
  },

  onCloseDefault(opt, setStateCallback) {
    this._close(setStateCallback);

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  buildHeaderChild_(headerTypes) {
    let headerType = this.getHeaderType(headerTypes);

    let headerChild;
    if (headerType === "contentOfStandardHeader") {
      headerChild = <Header content={headerTypes.header} />;
      headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild));
    }

    return headerChild;
  },

  expandHeaderProps_(headerChild) {
    let extendedHeaderProps = this._extendPartProps(headerChild.props, "header");
    if (extendedHeaderProps) {
      extendedHeaderProps._sticky = this.state.sticky;
      extendedHeaderProps._onClose = this._onCloseHandler;
    }
    return extendedHeaderProps;
  },

  buildFooterChild_(footerTypes) {
    let footerType = this.getFooterType(footerTypes);

    let footerChild;
    if (footerType === "contentOfStandardFooter") {
      footerChild = <Footer content={footerTypes.footer} />;
      footerChild = this.cloneChild(footerChild, this.expandFooterProps(footerChild));
    }

    return footerChild;
  },

  expandFooterProps_(footerChild) {
    return this._extendPartProps(footerChild.props, "footer");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _updateAfterCommit(prevHidden) {
    let { hidden, scrollableBackground } = this.state;
    if (hidden && !prevHidden) {
      // became closed
      openedModalStack = openedModalStack.filter((it) => it !== this);
      let { _closeCallbacks } = this;
      this._closeCallbacks = [];
      this._flushCloseCallbacks = () => _closeCallbacks.forEach((fn) => (typeof fn === "function" ? fn() : null));
      this._closeTimeout = setTimeout(() => {
        delete this._closeTimeout;

        enableBodyScrolling("modal-" + this.getId(), scrollableBackground);

        if (this.isRendered()) {
          this.setState(
            {
              header: this.state.renderContent ? this.state.header || this.getHeader() : null,
              content: this.state.renderContent ? this.state.content || this.getContent() || this.props.children : null,
              footer: this.state.renderContent ? this.state.footer || this.getFooter() : null,
              renderContent: true,
            },
            this._flushCloseCallbacks
          );
        }
      }, this.getDefault().animationDuration);
    } else if (!hidden && prevHidden) {
      // became opened
      openedModalStack = [...openedModalStack, this];

      // stop closing animation if we were in the process of closing window (but call callbacks if any were registered)
      if (this._closeTimeout) {
        clearTimeout(this._closeTimeout);
        delete this._closeTimeout;
        this._flushCloseCallbacks();
      }
      // hide body scrollbars
      if (!scrollableBackground) disableBodyScrolling("modal-" + this.getId());
    }
    this._prevHidden = !!hidden;
  },

  _closeByEsc(e) {
    if (typeof this.props._allowClose !== "function" || this.props._allowClose("id-" + this.getId())) {
      this._blur(e);
    }
  },

  _onBlurHandler(event) {
    if (event.target.id === this.getId()) {
      if (typeof this.props._allowClose !== "function" || this.props._allowClose("id-" + this.getId())) {
        this._blur(event);
      }
    }
    return this;
  },

  _onCloseHandler(e) {
    let opt = { component: this, event: e, closeType: this.getDefault().closeTypes.closedButton };

    if (typeof this.state.onClose === "function") {
      this.state.onClose(opt);
    } else {
      this.onCloseDefault(opt);
    }

    return this;
  },

  _blur(e) {
    if (typeof this.state.onClose === "function") {
      this.state.onClose({ component: this, event: e, closeType: this.getDefault().closeTypes.blur });
    } else {
      this._close();
    }
    return this;
  },

  _doClose(shouldOnClose, closeType, setStateCallback) {
    let _referrer;
    if (typeof shouldOnClose === "function") {
      setStateCallback = shouldOnClose;
      shouldOnClose = true;
    } else if (shouldOnClose != null && typeof shouldOnClose === "object") {
      _referrer = shouldOnClose._referrer;
      shouldOnClose = shouldOnClose.shouldOnClose;
    }

    // check if component that closing modal is the same that opens it
    if (_referrer && this.state._referrer !== _referrer) {
      // modal is trying to be close by another component that opens it
      return this;
    }

    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      centralModal.close({ shouldOnClose, _referrer }, setStateCallback);
    } else if (typeof this.state.onClose === "function" && shouldOnClose !== false) {
      this.state.onClose({
        component: this,
        closeType,
        callback: setStateCallback,
      });
    } else {
      this._close(setStateCallback);
    }
    return this;
  },

  _close(setStateCallback) {
    if (this.isRendered()) {
      let callCallbackHere; // if we're already hidden then nothing will be done in componentDidUpdate and therefore we'll have to call setStateCallback here right away
      this.setState(
        (state) => {
          callCallbackHere = state.hidden;
          if (!callCallbackHere) this._closeCallbacks.push(setStateCallback);
          return {
            hidden: true,
            renderContent: getMountContent(this.props, state) !== MOUNT_CONTENT_VALUES.onEachOpen,
          };
        },
        () => {
          if (callCallbackHere && typeof setStateCallback === "function") setStateCallback();
        }
      );
    }
  },

  _getEventPath(e) {
    let path = [];
    let node = e.target;
    while (node != document.body && node != document.documentElement && node) {
      path.push(node);
      node = node.parentNode;
    }
    return path;
  },

  _findTarget(e) {
    let modalMatch = "[id='" + this.getId() + "'] .uu5-bricks-modal-dialog";
    let result = {
      dialog: false,
    };
    let eventPath = this._getEventPath(e);
    eventPath.every((item) => {
      let functionType = item.matches ? "matches" : "msMatchesSelector";
      if (item[functionType]) {
        if (item[functionType](modalMatch)) {
          result.dialog = true;
        }
        return true;
      } else {
        return false;
      }
    });

    return result;
  },

  _getMainAttrs(hidden = this.isHidden()) {
    let mainAttrs = this.getMainAttrs();

    // id because of checking backdrop on click in _onBlurHandler function
    mainAttrs.id = this.getId();
    this.state.footer && (mainAttrs.className += " " + this.getClassName("isFooter"));
    this.state.className && (mainAttrs.className += " " + this.state.className);
    if (!this.state.sticky && !this.state.stickyBackground) {
      let allowBlur = true;
      mainAttrs.onMouseDown = (e) => {
        let clickData = this._findTarget(e.nativeEvent);
        if (clickData.dialog) {
          allowBlur = false;
        }
      };
      mainAttrs.onMouseUp = (e) => {
        if (allowBlur) {
          let clickData = this._findTarget(e.nativeEvent);
          if (clickData.dialog) {
            allowBlur = false;
          }
        }
      };
      mainAttrs.onClick = (e) => {
        if (allowBlur) {
          this._onBlurHandler(e);
        }
        allowBlur = true;
      };
    }

    if (this.state.overflow) {
      mainAttrs.className += " " + this.getClassName("overflow");
    }

    mainAttrs.className = mainAttrs.className.replace(/\s*\buu5-common-hidden\b\s*/, " ").trim();
    if (hidden) mainAttrs.className += " uu5-common-hidden";

    let sec = this.getDefault().animationDuration / 1000 + "s";
    mainAttrs.style = mainAttrs.style || {};
    mainAttrs.style.WebkitTransitionDuration = sec;
    mainAttrs.style.MozTransitionDuration = sec;
    mainAttrs.style.OTransitionDuration = sec;
    mainAttrs.style.transitionDuration = sec;

    return mainAttrs;
  },

  _getOpenProps(props = {}) {
    let newProps = {};
    newProps.header = props.header === undefined ? this.props.header : props.header;
    newProps.footer = props.footer === undefined ? this.props.footer : props.footer;
    newProps.content = props.content === undefined ? this.getContent() : props.content; // default value is null
    newProps.className = props.className === undefined ? this.props.className : props.className;
    newProps.size = props.size === undefined ? this.props.size : props.size;
    newProps.sticky = props.sticky === undefined ? this.props.sticky : props.sticky;
    newProps.stickyBackground =
      props.stickyBackground === undefined ? this.props.stickyBackground : props.stickyBackground;
    newProps.scrollableBackground =
      props.scrollableBackground === undefined ? this.props.scrollableBackground : props.scrollableBackground;
    newProps.onClose = props.onClose === undefined ? this.props.onClose : props.onClose;
    newProps.overflow = props.overflow === undefined ? this.props.overflow : props.overflow;
    newProps.mountContent = props.mountContent === undefined ? this.props.mountContent : props.mountContent;
    newProps.registerToModalBus =
      props.registerToModalBus === undefined ? this.props.registerToModalBus : props.registerToModalBus;
    newProps.fullscreen = props.fullscreen === undefined ? this.props.fullscreen : props.fullscreen;

    if ((newProps.content === undefined || newProps.content === null) && (this.props.children || props.children)) {
      newProps.content = props.children === undefined ? this.props.children : props.children;
    }

    return newProps;
  },

  _extendPartProps(partProps, part) {
    let newProps = {};

    // default values is used if child is set as react element so null or undefined will not set!!!
    for (let key in partProps) {
      partProps[key] !== null && partProps[key] !== undefined && (newProps[key] = partProps[key]);
    }

    newProps.key = newProps.id;

    return newProps;
  },

  _extendBodyProps(bodyProps) {
    let id = this.getId() + "-body";
    let className = this.state.overflow ? this.getClassName("bodyOverflow") : null;

    let newProps = {
      id: id,
      className: className,
    };

    // default values is used if child is set as react element so null or undefined will not set!!!
    for (let key in bodyProps) {
      bodyProps[key] !== null && bodyProps[key] !== undefined && (newProps[key] = bodyProps[key]);
    }

    return UU5.Common.Tools.merge(newProps, { key: newProps.id });
  },
  _shouldOpenPageModal() {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    return (
      !this.props.location &&
      !this.props.forceRender &&
      page &&
      page.getModal() &&
      page.getModal().getId() !== this.getId()
    );
  },

  _buildChildren() {
    let header = this.state.header;
    let footer = this.state.footer;
    let bodyContent = this.state.content;

    let headerChild;
    let footerChild;

    if (!bodyContent && !header) {
      header = this.getDefault().header;
      bodyContent = this.getDefault().body;
    }

    header && (headerChild = this.buildHeaderChild({ header: header }));
    footer && (footerChild = this.buildFooterChild({ footer: footer }));

    let bodyProps = this._extendBodyProps({ content: bodyContent });

    let bodyChild;

    if (bodyProps.content) {
      bodyChild = this.buildChildren({
        children: UU5.Common.Element.create(Body, bodyProps),
      });
    }

    return [headerChild, bodyChild, footerChild];
  },

  _renderModal(getContentFn) {
    let { location, _render } = this.props;
    let result;
    let { Uu5Elements } = OptionalLibraries;
    if (Uu5Elements) {
      let { header, content, footer, size, fullscreen } = this.state;
      result = (
        <Uu5Elements.Modal
          {...this.getMainPropsToPass()}
          className={[this.props.className, this.state.className].filter((v) => v).join(" ")} // omit main className (.uu5-bricks-modal)
          open={!this.state.hidden}
          onClose={(e) =>
            this._doClose(true, this.getDefault().closeTypes[e?.type === "click" ? "closedButton" : "blur"])
          }
          header={header}
          footer={footer}
          closeOnEsc={!this.isSticky()}
          closeOnOverlayClick={this.state.stickyBackground === false}
          closeOnButtonClick={!this.isSticky()}
          nestingLevel={this.getNestingLevel()}
          skipModalBus={!this.state.registerToModalBus}
          fullscreen={fullscreen}
          //scrollable={!this.state.overflow} // temporary removed because uu5g05 Modal does not render paddings if scrollable is false
          width={size === "s" ? 300 : size === "m" ? 600 : size === "l" ? 900 : size === "max" ? "full" : null}
        >
          {content}
        </Uu5Elements.Modal>
      );
    } else if (_render && !this.state.hidden && this.state.registerToModalBus) {
      result = this.props._render(
        <div className={this.getClassName("layoutWrapper")}>{this._buildChildren()}</div>,
        "id-" + this.getId(),
        {
          viewContentClassName: this._getModalBusClassName(),
          open: true,
          closeOnEsc: !this.isSticky(),
          closeOnOverlayClick: this.state.stickyBackground === false,
          scrollableBackground: undefined,
          onClose: this.close,
        }
      );
    } else if (location === "portal") {
      let { openKey } = this.state;
      let isClosing = this.isHidden() && this._prevHidden === false;
      let mountContent = getMountContent(this.props, this.state);
      let needsToBeRendered =
        isClosing ||
        mountContent === MOUNT_CONTENT_VALUES.onFirstRender ||
        (mountContent === MOUNT_CONTENT_VALUES.onFirstOpen && openKey != null) ||
        (mountContent === MOUNT_CONTENT_VALUES.onEachOpen && !this.isHidden());
      result = needsToBeRendered ? (
        <RenderIntoPortal>
          <DoubleRender renderKey={openKey} doubleRenderOnMount={true}>
            {(renderAs) => {
              // DoubleRender is for CSS transition - initial render will mount the content as invisible,
              // next render (run at next animation frame) will re-render the content as visible, triggerring transition
              let invisible = this.isHidden() || (renderAs === DoubleRender.FIRST_RENDER ? true : false);
              return getContentFn(invisible);
            }}
          </DoubleRender>
        </RenderIntoPortal>
      ) : null;
    } else {
      result = getContentFn();
    }
    return result;
  },

  _getModalBusClassName() {
    let classNames = [this.getClassName("modalBusViewContent"), this.getClassName("modalSize") + this.state.size];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    if (this.state.className) {
      classNames.push(this.state.className);
    }

    return classNames.join(" ").trim();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    // Todo uu5-size is maped to bootstrap-size
    // let size;
    // switch (this.state.size) {
    //   case 'l':
    //     size = 'lg';
    //     break;
    //   case 'm':
    //     size = 'md';
    //     break;
    //   default:
    //     size = 'sm';
    //     break;
    // }

    // disable rendering of modal if there is a modal on the page
    if (this._shouldOpenPageModal()) {
      return null;
    }

    return this.getNestingLevel()
      ? this._renderModal((hidden) => (
          <div {...this._getMainAttrs(hidden)}>
            <div
              className={[
                this.getClassName("dialog"),
                this.getClassName("modalSize") + this.state.size,
                this.getClassName("layoutWrapper"),
                this.state.fullscreen ? this.getClassName("fullscreen") : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {this._buildChildren()}
              {this.getDisabledCover()}
            </div>
          </div>
        ))
      : null;
  },
  //@@viewOff:render
});
_Modal._onCloseESC = function (e) {
  if (e.which === 27) {
    let lastModal = openedModalStack[openedModalStack.length - 1];
    if (lastModal && !lastModal.isSticky()) {
      lastModal._closeByEsc(e);
    }
  }
};

function withModalBus(Component) {
  let result = UU5.Common.Reference.forward((props, ref) => (
    <UU5.Common.ModalBusContext.Consumer>
      {({ render, allowClose }) => <Component {...props} ref={ref} _render={render} _allowClose={allowClose} />}
    </UU5.Common.ModalBusContext.Consumer>
  ));
  if (process.env.NODE_ENV === "test") result._originalComponent = Component;
  Object.assign(result, STATICS);
  return result;
}

export const Modal = withModalBus(_Modal);

export default Modal;
