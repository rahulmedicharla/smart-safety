import 'react-native-gesture-handler';
import { firebaseConfig } from './config';

import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './components/Navigation';

import { LogBox } from 'react-native';
import {PaperProvider} from 'react-native-paper'

export default function App() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
  
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}