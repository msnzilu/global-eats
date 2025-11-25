import Sidebar from '@/components/Sidebar';
import SidebarToggle from '@/components/SidebarToggle';
import { useDashboard } from '@/hooks/useDashboard';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
    const insets = useSafeAreaInsets();
    const [dateRange, setDateRange] = useState<7 | 14 | 30>(7);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const { stats, loading, error } = useDashboard(dateRange);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
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
                    <SidebarToggle onPress={() => setSidebarVisible(true)} />
                </View>
            </View>

            {/* Error Message */}
            {error && (
                <View style={{
                    backgroundColor: '#FEE2E2',
                    padding: 12,
                    marginHorizontal: 24,
                    marginTop: 16,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: '#EF4444'
                }}>
                    <Text style={{ color: '#991B1B', fontSize: 14 }}>
                        {error}
                    </Text>
                </View>
            )}

            {/* Loading State */}
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: Colors.light.text.secondary }}>
                        Loading dashboard...
                    </Text>
                </View>
            ) : (
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
                            value={stats?.mealsCompleted.toString() || '0'}
                            color={Colors.secondary.main}
                        />
                        <StatCard
                            icon="flame"
                            label="Avg Daily Calories"
                            value={stats?.avgDailyCalories.toString() || '0'}
                            color={Colors.primary.main}
                        />
                        <StatCard
                            icon="trophy"
                            label="Current Streak"
                            value={`${stats?.currentStreak || 0} days`}
                            color="#F59E0B"
                        />
                        <StatCard
                            icon="restaurant"
                            label="Top Cuisine"
                            value={stats?.topCuisine || 'None'}
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

                    {/* Macro Distribution */}
                    {stats && stats.macroDistribution && (
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
                                Macro Distribution
                            </Text>
                            <View style={{ gap: 12 }}>
                                <MacroBar
                                    label="Protein"
                                    percentage={stats.macroDistribution.protein}
                                    color="#EF4444"
                                />
                                <MacroBar
                                    label="Carbs"
                                    percentage={stats.macroDistribution.carbs}
                                    color="#3B82F6"
                                />
                                <MacroBar
                                    label="Fat"
                                    percentage={stats.macroDistribution.fat}
                                    color="#FBBF24"
                                />
                            </View>
                        </View>
                    )}

                    {/* Calorie Trend - Placeholder for now */}
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
                                Chart visualization coming soon
                            </Text>
                        </View>
                    </View>

                    {/* Meal Completion Rate - Placeholder for now */}
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
                                Chart visualization coming soon
                            </Text>
                        </View>
                    </View>

                    {/* Empty State */}
                    {stats && stats.mealsCompleted === 0 && (
                        <View style={{
                            alignItems: 'center',
                            paddingVertical: 40
                        }}>
                            <Ionicons name="stats-chart-outline" size={64} color={Colors.light.text.tertiary} />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: Colors.light.text.primary,
                                marginTop: 16,
                                marginBottom: 8
                            }}>
                                No Data Yet
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: Colors.light.text.secondary,
                                textAlign: 'center',
                                paddingHorizontal: 40
                            }}>
                                Complete some meals to see your statistics
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
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

interface MacroBarProps {
    label: string;
    percentage: number;
    color: string;
}

function MacroBar({ label, percentage, color }: MacroBarProps) {
    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6
            }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.light.text.primary
                }}>
                    {label}
                </Text>
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.light.text.secondary
                }}>
                    {percentage}%
                </Text>
            </View>
            <View style={{
                height: 8,
                backgroundColor: Colors.light.surface,
                borderRadius: 4,
                overflow: 'hidden'
            }}>
                <View style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: color,
                    borderRadius: 4
                }} />
            </View>
        </View>
    );
}
