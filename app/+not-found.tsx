import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from './contexts/AuthContext';

export default function NotFoundScreen() {
  const router = useRouter();
  const { user, userType } = useAuth();

  const handleGoHome = () => {
    if (userType === 'shopkeeper') {
      router.replace('/(shopkeeper)/shopkeeper/dashboard');
    } else if (userType === 'storemanager') {
      router.replace('/(storemanager)/storemanager/dashboard');
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Animated Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.animationWrapper}>
            <Ionicons name="compass-outline" size={120} color="#6366F1" />
          </View>
          <View style={styles.errorBadge}>
            <Text style={styles.errorCode}>404</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Lost Your Way?</Text>
          <Text style={styles.subtitle}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Text style={styles.description}>
            Don't worry, even the best explorers get lost sometimes. Let's get you back to your dashboard.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGoHome}
            activeOpacity={0.9}
          >
            <Ionicons name="home-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  animationWrapper: {
    position: 'relative',
  },
  errorBadge: {
    position: 'absolute',
    top: -15,
    right: -20,
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  errorCode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});