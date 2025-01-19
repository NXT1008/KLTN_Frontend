import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Badge
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon
} from '@mui/icons-material'

function AppBarComponent() {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Good Morning Dr.Matthew
        </Typography>
        <IconButton>
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton>
          <Badge badgeContent={12} color="secondary">
            <MessageIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default AppBarComponent
