import { Text, View } from 'react-native';

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 320,
          height: 10,
          backgroundColor: '#e5e5e5',
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: '#007AFF',
            borderRadius: 5,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 14,
          color: '#666',
          marginTop: 8,
        }}>
        {current} / {total} completed
      </Text>
    </View>
  );
}
