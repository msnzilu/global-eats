import { useAuth } from '@/hooks/useAuth';
import { useMealPlan } from '@/hooks/useMealPlan';
import { MealPlan } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MealPlanHistory() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { getAllPlans, setActivePlan, deletePlan, activePlan } = useMealPlan();
    const { profile } = useAuth();

    const [plans, setPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const allPlans = await getAllPlans();
            setPlans(allPlans);
        } catch (err: any) {
            setError(err.message || 'Failed to load meal plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSetActive = async (planId: string) => {
        try {
            await setActivePlan(planId);
            Alert.alert('Success', 'Meal plan activated successfully');
            await loadPlans(); // Refresh the list
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to activate meal plan');
        }
    };

    const handleDelete = (planId: string, planName: string) => {
        Alert.alert(
            'Delete Meal Plan',
            `Are you sure you want to delete this ${planName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePlan(planId);
                            Alert.alert('Success', 'Meal plan deleted successfully');
                            await loadPlans(); // Refresh the list
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to delete meal plan');
                        }
                    }
                }
            ]
        );
    };

    const handleExport = async (plan: MealPlan) => {
        // @ts-ignore
        if (profile?.subscriptionTier === 'free') {
             Alert.alert(
                'Premium Feature',
                'Exporting meal plans is available for Premium users only.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade', onPress: () => router.push('/subscription/manage') }
                ]
            );
            return;
        }

        try {
            const planName = `${plan.duration}-Day Plan`;
            const date = formatDate(plan.createdAt);
            let message = `📅 ${planName} (${date})\n\n`;

            plan.days.forEach((day, index) => {
                message += `Day ${index + 1}\n`;
                day.meals.forEach(meal => {
                    message += `• ${meal.mealType}: ${meal.recipeName} (${meal.calories} cal)\n`;
                });
                message += '\n';
            });

            await Share.share({
                message,
                title: `Meal Plan Export - ${date}`
            });
        } catch (err) {
            console.error('Export error:', err);
            Alert.alert('Error', 'Failed to export meal plan');
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
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
                        Meal Plan History
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: Colors.light.text.secondary }}>
                        Loading meal plans...
                    </Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
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
                        Meal Plan History
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Ionicons name="alert-circle-outline" size={64} color={Colors.light.text.tertiary} />
                    <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: Colors.light.text.primary }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadPlans}
                        style={{
                            marginTop: 24,
                            backgroundColor: Colors.primary.main,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 12
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', flex: 1 }}>
                    Meal Plan History
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: 80
                }}
            >
                {plans.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                        <Ionicons name="calendar-outline" size={64} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: Colors.light.text.primary,
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No Meal Plans Yet
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            textAlign: 'center'
                        }}>
                            Create your first meal plan to get started
                        </Text>
                    </View>
                ) : (
                    plans.map((plan) => {
                        const isActive = plan.id === activePlan?.id;
                        const planName = `${plan.duration}-Day Plan`;

                        return (
                            <View
                                key={plan.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 16,
                                    padding: 20,
                                    marginBottom: 16,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 3,
                                    borderWidth: isActive ? 2 : 0,
                                    borderColor: isActive ? Colors.primary.main : 'transparent'
                                }}
                            >
                                {/* Active Badge */}
                                {isActive && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        backgroundColor: Colors.primary.main,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 20
                                    }}>
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                                            ACTIVE
                                        </Text>
                                    </View>
                                )}

                                {/* Plan Info */}
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: Colors.light.text.primary,
                                    marginBottom: 8
                                }}>
                                    {planName}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="calendar-outline" size={16} color={Colors.light.text.secondary} />
                                    <Text style={{
                                        fontSize: 14,
                                        color: Colors.light.text.secondary,
                                        marginLeft: 8
                                    }}>
                                        Created {formatDate(plan.createdAt)}
                                    </Text>
                                </View>

                                {plan.selectedCuisines.length > 0 && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Ionicons name="restaurant-outline" size={16} color={Colors.light.text.secondary} />
                                        <Text style={{
                                            fontSize: 14,
                                            color: Colors.light.text.secondary,
                                            marginLeft: 8
                                        }}>
                                            {plan.selectedCuisines.join(', ')}
                                        </Text>
                                    </View>
                                )}

                                {/* First Day Preview */}
                                {plan.days.length > 0 && (
                                    <View style={{
                                        backgroundColor: Colors.light.surface,
                                        borderRadius: 12,
                                        padding: 12,
                                        marginBottom: 16
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '600',
                                            color: Colors.light.text.tertiary,
                                            marginBottom: 8
                                        }}>
                                            FIRST DAY PREVIEW
                                        </Text>
                                        {plan.days[0].meals.slice(0, 3).map((meal, index) => (
                                            <Text
                                                key={index}
                                                style={{
                                                    fontSize: 14,
                                                    color: Colors.light.text.primary,
                                                    marginBottom: 4
                                                }}
                                            >
                                                • {meal.recipeName}
                                            </Text>
                                        ))}
                                    </View>
                                )}

                                {/* Action Buttons */}
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    {!isActive && (
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                backgroundColor: Colors.primary.main,
                                                paddingVertical: 12,
                                                borderRadius: 10,
                                                alignItems: 'center'
                                            }}
                                            onPress={() => handleSetActive(plan.id)}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: 'white'
                                            }}>
                                                Set as Active
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            backgroundColor: Colors.light.surface,
                                            paddingVertical: 12,
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: Colors.secondary.main,
                                            marginRight: 8
                                        }}
                                        onPress={() => handleExport(plan)}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: Colors.secondary.main
                                        }}>
                                            Export
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: isActive ? 1 : 0,
                                            paddingHorizontal: isActive ? 0 : 16,
                                            backgroundColor: Colors.light.surface,
                                            paddingVertical: 12,
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#EF4444'
                                        }}
                                        onPress={() => handleDelete(plan.id, planName)}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#EF4444'
                                        }}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}
