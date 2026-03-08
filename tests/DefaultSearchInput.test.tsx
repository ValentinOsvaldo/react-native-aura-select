import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { DefaultSearchInput } from '../src/components/DefaultSearchInput';

describe('DefaultSearchInput', () => {
  it('renders with placeholder', () => {
    render(
      <DefaultSearchInput
        value=""
        onChangeText={() => {}}
        placeholder="Search options..."
      />
    );
    expect(screen.getByPlaceholderText('Search options...')).toBeTruthy();
  });

  it('displays value', () => {
    render(
      <DefaultSearchInput
        value="query"
        onChangeText={() => {}}
        placeholder="Search..."
      />
    );
    const input = screen.getByDisplayValue('query');
    expect(input).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(
      <DefaultSearchInput
        value=""
        onChangeText={onChangeText}
        placeholder="Search..."
      />
    );
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'new');
    expect(onChangeText).toHaveBeenCalledWith('new');
  });

  it('uses default placeholder when not provided', () => {
    render(
      <DefaultSearchInput value="" onChangeText={() => {}} />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });
});
