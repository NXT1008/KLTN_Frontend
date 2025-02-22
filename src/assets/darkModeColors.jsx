const lightModecolor = {
  primary: '#004E64',
  lightPrimary: '#00A5CF',
  darkPrimary: '#25A18E',
  background: '#ffffff',
  text: '#212121',
  lightText: '#757575',
  hoverBackground: '#7AE582',
  selectedBackground: '#004E64',
  selectedText: '#ffffff',
  selectedIcon: '#ffffff',
  footerText: '#004E64',
  accent: '#25A18E',
  border: '#9FFFCB',
  modalBackground: '#f0f0f0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  lightBackground: '#f5f5f5',
  darkBackground: '#212121',
  hightlightBackground: '#9FFFCB',
  gradient: 'linear-gradient(to bottom, #004E64, #00A5CF)'
}


const darkModeColors = {
  primary: '#004E64',
  lightPrimary: '#00A5CF',
  darkPrimary: '#25A18E',
  background: '#121212',
  text: '#ffffff',
  lightText: '#b0b0b0',
  hoverBackground: '#7AE582',
  selectedBackground: '#004E64',
  selectedText: '#ffffff',
  selectedIcon: '#ffffff',
  footerText: '#004E64',
  accent: '#25A18E',
  border: '#004E64',
  modalBackground: '#333333',
  shadow: 'rgba(0, 0, 0, 0.6)',
  lightBackground: '#333333',
  darkBackground: '#121212',
  hightlightBackground: '#9FFFCB',
  gradient: 'linear-gradient(to bottom, #004E64, #00A5CF)'
}

const color = (darkMode) => (darkMode ? darkModeColors : lightModecolor)

export default color
