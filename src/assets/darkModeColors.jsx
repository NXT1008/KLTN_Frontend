const lightModeColors = {
  primary: '#1976d2', // Deep Blue
  lightPrimary: '#42a5f5', // Light Blue
  darkPrimary: '#1565c0', // Dark Blue
  background: '#ffffff', // Light background
  text: '#212121', // Main text (black)
  lightText: '#757575', // Light text
  hoverBackground: '#bbdefb', // Hover background (light blue)
  selectedBackground: '#1976d2', // Selected background (deep blue)
  selectedText: '#ffffff', // Selected text (white)
  selectedIcon: '#ffffff', // Selected icon (white)
  footerText: '#1976d2', // Footer text (deep blue)
  accent: '#388e3c', // Accent color (green)
  border: '#b0bec5', // Light border (gray)
  modalBackground: '#f0f0f0', // Modal background (light gray)
  sidebarShadow: 'rgba(0, 0, 0, 0.1)', // Sidebar shadow
  lightBackground: '#f5f5f5', // Extra light background
  darkBackground: '#212121', // Unused in light mode
  gradient: 'linear-gradient(to bottom, ##1CD8D2, #1565c0)' // Gradient background
}

const darkModeColors = {
  primary: '#1976d2', // Deep Blue
  lightPrimary: '#42a5f5', // Light Blue
  darkPrimary: '#1565c0', // Dark Blue
  background: '#212121', // Dark background
  text: '#e0e0e0', // Light text for dark mode
  lightText: '#b0bec5', // Extra light text
  hoverBackground: '#424242', // Hover background (dark gray)
  selectedBackground: '#388e3c', // Selected background (green accent)
  selectedText: '#ffffff', // Selected text (white)
  selectedIcon: '#ffffff', // Selected icon (white)
  footerText: '#b0bec5', // Footer text (light gray)
  accent: '#388e3c', // Accent color (green)
  border: '#424242', // Border for dark mode
  modalBackground: '#424242', // Modal background (dark gray)
  sidebarShadow: 'rgba(0, 0, 0, 0.3)', // Sidebar shadow
  lightBackground: '#333333', // Extra dark background
  darkBackground: '#212121', // Dark base background
  gradient: 'linear-gradient(to bottom, ##1CD8D2, #1565c0)'
}

// Export function to toggle between light and dark mode
const colors = (darkMode) => (darkMode ? darkModeColors : lightModeColors)

export default colors
