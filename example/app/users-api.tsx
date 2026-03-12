import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Select } from 'react-native-aura-select';
import type { SelectRenderItemProps } from 'react-native-aura-select';
import { ShadcnSearchInput, ShadcnSelectInput } from './components/ShadcnInputs';
import { HeaderThemed, SurfaceThemed, TextThemed } from './context/Themed';
import { useTheme } from './context/ThemeContext';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

function avatarUri(user: User): string {
  return `https://i.pravatar.cc/120?img=${user.id}`;
}

function UserRow({ item, isSelected, getLabel, color, accentColor, secondaryColor }: SelectRenderItemProps<User>) {
  return (
    <View style={rowStyles.row}>
      <Image
        source={{ uri: avatarUri(item) }}
        style={rowStyles.avatar}
        contentFit="cover"
      />
      <View style={rowStyles.textBlock}>
        <Text style={[rowStyles.name, { color }]} numberOfLines={1}>
          {getLabel(item)}
        </Text>
        <Text style={[rowStyles.email, { color: secondaryColor }]} numberOfLines={1}>
          {item.email}
        </Text>
      </View>
      {isSelected ? (
        <Text style={[rowStyles.checkmark, { color: accentColor }]}>✓</Text>
      ) : null}
    </View>
  );
}

export default function UsersApiExample() {
  const router = useRouter();
  const { colors, modalTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(USERS_API)
      .then((res) => res.json())
      .then((data: User[]) => {
        if (!cancelled) setUsers(data);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getLabel = useCallback((item: User) => item.name, []);
  const getValue = useCallback((item: User) => item.id, []);

  return (
    <SurfaceThemed variant="screen">
      <HeaderThemed onBack={() => router.back()} title="Users (API)" />
      <View style={styles.content}>
        <TextThemed variant="muted" style={styles.sectionLabel}>
          Select a user (JSONPlaceholder)
        </TextThemed>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.accent} />
            <TextThemed variant="muted" style={styles.loadingText}>Loading users...</TextThemed>
          </View>
        ) : (
          <Select<User>
            options={users}
            value={selected}
            onChange={setSelected}
            placeholder="Select a user..."
            modalTitle="Select a user"
            searchable
            customInput={ShadcnSelectInput}
            customSearchInput={ShadcnSearchInput}
            getLabel={getLabel}
            getValue={getValue}
            keyExtractor={(item) => String(item.id)}
            renderItem={UserRow}
            modalTheme={modalTheme}
          />
        )}
      </View>
    </SurfaceThemed>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 15,
    marginBottom: 12,
  },
  loading: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
  },
  checkmark: {
    fontSize: 22,
    fontWeight: '600',
  },
});
