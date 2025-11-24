import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Notifications() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { preferences, isLoading, updatePreferences } = useNotificationPreferences();

    const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
        try {
            await updatePreferences({ [key]: value });
        } catch (error) {
            Alert.alert('Error', 'Failed to update notification preferences. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                    Loading preferences...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Notification Settings
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                {/* Push Notifications */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Push Notifications
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Receive notifications on your device
                            </Text>
                        </View>
                        <Switch
                            value={preferences.pushEnabled}
                            onValueChange={(value) => handleToggle('pushEnabled', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Email Notifications */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Email Notifications
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Receive updates via email
                            </Text>
                        </View>
                        <Switch
                            value={preferences.emailEnabled}
                            onValueChange={(value) => handleToggle('emailEnabled', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.light.text.secondary,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                }}>
                    Notification Types
                </Text>

                {/* Meal Reminders */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Meal Reminders
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Reminders for upcoming meals
                            </Text>
                        </View>
                        <Switch
                            value={preferences.mealReminders}
                            onValueChange={(value) => handleToggle('mealReminders', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Plan Updates */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Plan Updates
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                When your meal plan is ready
                            </Text>
                        </View>
                        <Switch
                            value={preferences.planUpdates}
                            onValueChange={(value) => handleToggle('planUpdates', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Recipe Updates */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                New Recipes
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Discover new recipe suggestions
                            </Text>
                        </View>
                        <Switch
                            value={preferences.recipeUpdates}
                            onValueChange={(value) => handleToggle('recipeUpdates', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Shopping Reminders */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Shopping Reminders
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Reminders to check your shopping list
                            </Text>
                        </View>
                        <Switch
                            value={preferences.shoppingReminders}
                            onValueChange={(value) => handleToggle('shoppingReminders', value)}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
