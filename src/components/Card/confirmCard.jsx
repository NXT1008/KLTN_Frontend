import { useContext } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Confirm', message }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ color: color.text, backgroundColor: color.background }}>{title}</DialogTitle>
      <DialogContent style={{ color: color.text, backgroundColor: color.background }}>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions style={{ color: color.text, backgroundColor: color.background }}>
        <Button onClick={onClose} sx={{
          color: color.text,
          '&:hover': {
            color: color.selectedText,
            backgroundColor: color.hoverBackground
          }
        }}>Cancel</Button>
        <Button onClick={onConfirm} sx={{
          color: color.background,
          backgroundColor: color.primary,
          '&:hover': {
            color: color.selectedText,
            backgroundColor: color.hoverBackground
          } }}>Continue</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
