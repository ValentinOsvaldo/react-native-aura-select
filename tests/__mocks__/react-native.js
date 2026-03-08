const React = require('react');

const View = (props) => React.createElement('View', props, props.children);
const Text = (props) => React.createElement('Text', props, props.children);
const TextInput = (props) => React.createElement('TextInput', props);
const Pressable = (props) =>
  React.createElement('Pressable', { ...props, onPress: props.onPress }, props.children);
const Modal = (props) => React.createElement('Modal', props, props.children);
const FlatList = (props) => {
  const data = props.data || [];
  const keyExtractor = props.keyExtractor || ((item, i) => String(i));
  const renderItem = props.renderItem || (() => null);
  const items = data.map((item, index) => {
    const element = renderItem({ item, index, separators: {} });
    return element && React.cloneElement(element, { key: keyExtractor(item, index) });
  });
  return React.createElement(View, props, items);
};
const ActivityIndicator = (props) =>
  React.createElement('ActivityIndicator', props);
const Image = (props) => React.createElement('Image', props);
const Switch = (props) => React.createElement('Switch', props);
const ScrollView = (props) =>
  React.createElement('ScrollView', props, props.children);

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => {
    if (style == null) return {};
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.map(StyleSheet.flatten));
    }
    return style;
  },
  hairlineWidth: 1,
};

module.exports = {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  Switch,
  ScrollView,
  StyleSheet,
};
