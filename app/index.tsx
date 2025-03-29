import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Link href="/screenOne" asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Card One</Text>
          <Text style={styles.cardDescription}>Navigate to the first screen.</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/screenTwo" asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Card Two</Text>
          <Text style={styles.cardDescription}>Navigate to the second screen.</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Use space-between for even spacing at edges
    alignItems: 'flex-start',
    padding: 20, // Increased padding
    backgroundColor: '#f8f9fa', // Softer background for the screen
  },
  card: {
    width: '48%', // Adjust width slightly for better spacing with space-between
    padding: 25, // Increased padding inside card
    marginVertical: 10,
    backgroundColor: '#ffffff', // Keep card background white
    borderRadius: 12, // Slightly larger border radius
    alignItems: 'flex-start', // Align content to the left
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // Slightly increased shadow offset
    },
    shadowOpacity: 0.15, // Reduced shadow opacity for subtlety
    shadowRadius: 4.65, // Adjusted shadow radius
    elevation: 6, // Adjusted elevation
    borderWidth: 1,
    borderColor: '#e9ecef' // Subtle border
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600', // Slightly bolder
    marginBottom: 8, // Increased space below title
    color: '#212529' // Darker text color
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'left', // Align description text left
    color: '#495057' // Slightly lighter text color for description
  },
}); 