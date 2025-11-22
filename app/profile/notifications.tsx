import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Notifications() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [mealReminders, setMealReminders] = useState(true);
    const [planUpdates, setPlanUpdates] = useState(true);
    const [recipeUpdates, setRecipeUpdates] = useState(false);
    const [shoppingReminders, setShoppingReminders] = useState(true);

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
                    Notifications
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
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
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
                            value={emailEnabled}
                            onValueChange={setEmailEnabled}
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
                            value={mealReminders}
                            onValueChange={setMealReminders}
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
                            value={planUpdates}
                            onValueChange={setPlanUpdates}
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
                            value={recipeUpdates}
                            onValueChange={setRecipeUpdates}
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
                            value={shoppingReminders}
                            onValueChange={setShoppingReminders}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
