import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants';

export default function HomeScreen() {
    const router = useRouter();

    // Sample data - replace with real data from your backend
    const weeklyMeals = [
        { day: 'Mon', meal: 'Grilled Chicken Salad', calories: 450 },
        { day: 'Tue', meal: 'Veggie Stir Fry', calories: 380 },
        { day: 'Wed', meal: 'Salmon & Quinoa', calories: 520 },
        { day: 'Thu', meal: 'Pasta Primavera', calories: 410 },
        { day: 'Fri', meal: 'Beef Tacos', calories: 480 },
    ];

    const stats = {
        mealsPlanned: 12,
        caloriesWeek: 3240,
        recipiesSaved: 24
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: 60,
                paddingBottom: 32,
                paddingHorizontal: 24,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
                            Welcome back,
                        </Text>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                            John Doe
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ fontSize: 24 }}>👤</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={{ paddingHorizontal: 24, marginTop: -20 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 24
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 16,
                        marginRight: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.primary.main }}>
                            {stats.mealsPlanned}
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 4 }}>
                            Meals Planned
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 16,
                        marginLeft: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.secondary.main }}>
                            {stats.recipiesSaved}
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 4 }}>
                            Saved Recipes
                        </Text>
                    </View>
                </View>
            </View>

            {/* This Week's Meals */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.light.text.primary }}>
                        This Week's Meals
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 14, color: Colors.primary.main, fontWeight: '600' }}>
                            See All
                        </Text>
                    </TouchableOpacity>
                </View>

                {weeklyMeals.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: 'white',
                            padding: 16,
                            borderRadius: 12,
                            marginBottom: 12,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                            elevation: 2
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                backgroundColor: Colors.primary.light,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.primary.main }}>
                                    {item.day}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.text.primary }}>
                                    {item.meal}
                                </Text>
                                <Text style={{ fontSize: 13, color: Colors.light.text.secondary, marginTop: 2 }}>
                                    {item.calories} cal
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 20 }}>🍽️</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.light.text.primary, marginBottom: 16 }}>
                    Quick Actions
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: Colors.primary.main,
                        padding: 20,
                        borderRadius: 16,
                        marginRight: 8,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>📅</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', textAlign: 'center' }}>
                            Plan Meals
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: Colors.secondary.main,
                        padding: 20,
                        borderRadius: 16,
                        marginHorizontal: 8,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', textAlign: 'center' }}>
                            Find Recipes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: Colors.primary.dark,
                        padding: 20,
                        borderRadius: 16,
                        marginLeft: 8,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>🛒</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', textAlign: 'center' }}>
                            Shopping List
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}