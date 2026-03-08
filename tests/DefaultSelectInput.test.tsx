import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { DefaultSelectInput } from '../src/components/DefaultSelectInput';

describe('DefaultSelectInput', () => {
  it('renders placeholder when value is empty', () => {
    render(
      <DefaultSelectInput
        value=""
        onPress={() => {}}
        placeholder="Choose..."
      />
    );
    expect(screen.getByText('Choose...')).toBeTruthy();
  });

  it('renders value when provided', () => {
    render(
      <DefaultSelectInput
        value="Selected option"
        onPress={() => {}}
        placeholder="Choose..."
      />
    );
    expect(screen.getByText('Selected option')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(
      <DefaultSelectInput value="" onPress={onPress} placeholder="Select..." />
    );
    fireEvent.press(screen.getByText('Select...'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <DefaultSelectInput
        value=""
        onPress={onPress}
        placeholder="Select..."
        disabled
      />
    );
    fireEvent.press(screen.getByText('Select...'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders custom content when content prop is provided', () => {
    render(
      <DefaultSelectInput
        value=""
        onPress={() => {}}
        content={<Text>Custom chips</Text>}
      />
    );
    expect(screen.getByText('Custom chips')).toBeTruthy();
  });

  it('still shows chevron', () => {
    render(
      <DefaultSelectInput value="Test" onPress={() => {}} />
    );
    expect(screen.getByText('▼')).toBeTruthy();
  });
});
