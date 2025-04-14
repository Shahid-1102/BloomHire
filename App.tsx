import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JobsScreen } from './src/screens/JobsScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { JobDetailScreen } from './src/screens/JobDetailScreen';
import type { Job } from './src/types/job';

export type RootStackParamList = {
  JobsList: undefined;
  BookmarksList: undefined;
  JobDetail: { job: Job };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobsList" component={JobsScreen} options={{ title: 'Jobs' }} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

function BookmarksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookmarksList" component={BookmarksScreen} options={{ title: 'Bookmarks' }} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Jobs" 
          component={JobsStack}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Text style={{ fontSize: size, color }}>💼</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Bookmarks" 
          component={BookmarksStack}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Text style={{ fontSize: size, color }}>♥️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
