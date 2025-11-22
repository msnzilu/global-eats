import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RateApp() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

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
                    Rate GlobalEats
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24,
                    alignItems: 'center'
                }}
            >
                {/* Icon */}
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: `${Colors.primary.main}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                    marginBottom: 24
                }}>
                    <Text style={{ fontSize: 48 }}>🍽️</Text>
                </View>

                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 8
                }}>
                    Enjoying GlobalEats?
                </Text>

                <Text style={{
                    fontSize: 14,
                    color: Colors.light.text.secondary,
                    textAlign: 'center',
                    marginBottom: 32,
                    lineHeight: 20
                }}>
                    Your feedback helps us improve and serve you better!
                </Text>

                {/* Star Rating */}
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 32
                }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                        >
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={48}
                                color={star <= rating ? "#F59E0B" : Colors.light.border}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Rating Text */}
                {rating > 0 && (
                    <Text style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: Colors.primary.main,
                        marginBottom: 24
                    }}>
                        {rating === 5 ? '🎉 Amazing!' :
                            rating === 4 ? '😊 Great!' :
                                rating === 3 ? '👍 Good' :
                                    rating === 2 ? '😐 Okay' :
                                        '😞 Needs Work'}
                    </Text>
                )}

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: 12 }}>
                    {rating >= 4 && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary.main,
                                padding: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                            onPress={() => {/* TODO: Open app store */ }}
                        >
                            <Ionicons name="star" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                Rate on App Store
                            </Text>
                        </TouchableOpacity>
                    )}

                    {rating > 0 && rating < 4 && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.secondary.main,
                                padding: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                            onPress={() => router.push('/profile/contact')}
                        >
                            <Ionicons name="chatbubbles" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                Send Feedback
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.light.surface,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        onPress={() => router.back()}
                    >
                        <Text style={{ color: Colors.light.text.secondary, fontSize: 16, fontWeight: '600' }}>
                            Maybe Later
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 32,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 18,
                        textAlign: 'center'
                    }}>
                        💡 Your rating helps other users discover GlobalEats and motivates us to keep improving!
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
