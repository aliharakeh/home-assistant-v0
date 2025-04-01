import { TouchableOpacity, View } from 'react-native';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    withBorder?: boolean;
    clickable?: boolean;
    onPress?: () => void;
    touchOpacity?: number;
}

export function Card(p: CardProps) {
    const withBorder = p.withBorder ?? true;
    const borderClass = withBorder ? 'p-4 mb-4 border border-gray-300 rounded-xl shadow-sm' : '';

    if (p.clickable) {
        return (
            <TouchableOpacity
                className={`bg-white ${borderClass} ${p.className}`}
                onPress={p.onPress}
                activeOpacity={p.touchOpacity}
            >
                {p.children}
            </TouchableOpacity>
        );
    }

    return <View className={`bg-white ${borderClass} ${p.className}`}>{p.children}</View>;
}
