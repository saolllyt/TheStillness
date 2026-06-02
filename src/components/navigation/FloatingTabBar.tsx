import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface Props extends BottomTabBarProps {
  icons: Record<string, keyof typeof Feather.glyphMap>;
  hiddenRoutes?: Set<string>;
}

export const FloatingTabBar: React.FC<Props> = ({
  state,
  navigation,
  icons,
  hiddenRoutes,
}) => {
  // Скрываем навбар на некоторых экранах 
  if (hiddenRoutes?.size) {
    const cur = state.routes[state.index];
    const focused = getFocusedRouteNameFromRoute(cur) ?? cur.name;
    if (hiddenRoutes.has(focused)) return null;
  }

  return (
    <View style={styles.bar}>
      {state.routes.map((route, i) => {
        const isFocused = state.index === i;
        const icon = icons[route.name] ?? 'circle';

        const onPress = () => {
          const ev = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !ev.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.item}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Feather
                name={icon}
                size={22}
                color={isFocused ? COLORS.white : COLORS.textMuted}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BAR_HEIGHT = 64;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',       
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: BAR_HEIGHT / 2,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  item: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',  
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapActive: {
    backgroundColor: COLORS.primary,
  },
});
