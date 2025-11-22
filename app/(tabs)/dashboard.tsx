import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
    const insets = useSafeAreaInsets();
    const [dateRange, setDateRange] = useState<7 | 14 | 30>(7);

    // Mock data - will be replaced with real data from Firestore
    const stats = {
        mealsCompleted: 18,
        avgDailyCalories: 2150,
        currentStreak: 5,
        topCuisine: 'Indian'
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 8
                }}>
                    Dashboard
                </Text>
                <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    Track your nutrition and progress
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 100 + insets.bottom
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Stats Cards */}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 24,
                    gap: 12
                }}>
                    <StatCard
                        icon="checkmark-circle"
                        label="Meals Completed"
                        value={stats.mealsCompleted.toString()}
                        color={Colors.secondary.main}
                    />
                    <StatCard
                        icon="flame"
                        label="Avg Daily Calories"
                        value={stats.avgDailyCalories.toString()}
                        color={Colors.primary.main}
                    />
                    <StatCard
                        icon="trophy"
                        label="Current Streak"
                        value={`${stats.currentStreak} days`}
                        color="#F59E0B"
                    />
                    <StatCard
                        icon="restaurant"
                        label="Top Cuisine"
                        value={stats.topCuisine}
                        color="#8B5CF6"
                    />
                </View>

                {/* Date Range Selector */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 4,
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3
                }}>
                    {([7, 14, 30] as const).map((days) => (
                        <TouchableOpacity
                            key={days}
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                borderRadius: 8,
                                backgroundColor: dateRange === days ? Colors.primary.main : 'transparent'
                            }}
                            onPress={() => setDateRange(days)}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 14,
                                fontWeight: '600',
                                color: dateRange === days ? 'white' : Colors.light.text.secondary
                            }}>
                                {days} Days
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Charts Section - Placeholder */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Weekly Macros
                    </Text>
                    <View style={{
                        height: 200,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.light.surface,
                        borderRadius: 12
                    }}>
                        <Ionicons name="pie-chart-outline" size={48} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            marginTop: 12
                        }}>
                            Pie chart will appear here
                        </Text>
                    </View>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Calorie Trend
                    </Text>
                    <View style={{
                        height: 200,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.light.surface,
                        borderRadius: 12
                    }}>
                        <Ionicons name="analytics-outline" size={48} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            marginTop: 12
                        }}>
                            Line chart will appear here
                        </Text>
                    </View>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Meal Completion Rate
                    </Text>
                    <View style={{
                        height: 200,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.light.surface,
                        borderRadius: 12
                    }}>
                        <Ionicons name="bar-chart-outline" size={48} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            marginTop: 12
                        }}>
                            Bar chart will appear here
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <View style={{
            flex: 1,
            minWidth: '47%',
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
        }}>
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${color}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
            }}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: Colors.light.text.primary,
                marginBottom: 4
            }}>
                {value}
            </Text>
            <Text style={{
                fontSize: 12,
                color: Colors.light.text.secondary
            }}>
                {label}
            </Text>
        </View>
    );
}
