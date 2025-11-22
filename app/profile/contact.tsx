import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Contact() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');

    const categories = ['General', 'Bug Report', 'Feature Request', 'Account Issue', 'Other'];

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
                    Contact Us
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                <Text style={{
                    fontSize: 14,
                    color: Colors.light.text.secondary,
                    marginBottom: 20,
                    lineHeight: 20
                }}>
                    Have a question or feedback? We'd love to hear from you!
                </Text>

                {/* Category */}
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Category
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: selectedCategory === category ? Colors.primary.main : Colors.light.border,
                                backgroundColor: selectedCategory === category ? `${Colors.primary.main}15` : 'white'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                fontSize: 13,
                                color: selectedCategory === category ? Colors.primary.main : Colors.light.text.secondary
                            }}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Subject */}
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Subject
                </Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors.light.border,
                        marginBottom: 20
                    }}
                    placeholder="Brief description of your inquiry"
                    value={subject}
                    onChangeText={setSubject}
                />

                {/* Message */}
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Message
                </Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors.light.border,
                        minHeight: 150,
                        textAlignVertical: 'top'
                    }}
                    placeholder="Tell us more about your question or feedback..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                />

                {/* Contact Info */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 20,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 8
                    }}>
                        Other Ways to Reach Us
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name="mail" size={16} color={Colors.light.text.secondary} />
                        <Text style={{
                            fontSize: 13,
                            color: Colors.light.text.secondary,
                            marginLeft: 8
                        }}>
                            support@globaleats.com
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time" size={16} color={Colors.light.text.secondary} />
                        <Text style={{
                            fontSize: 13,
                            color: Colors.light.text.secondary,
                            marginLeft: 8
                        }}>
                            We typically respond within 24 hours
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Send Button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    onPress={() => {/* TODO: Send */ }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        Send Message
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
