# GMC Panel - Minecraft Server Management Panel

A Pterodactyl-like server management panel for Minecraft servers built with Node.js, Express, and SQLite.

## Features

✅ **User Management**
- Admin and user roles
- Secure authentication with bcrypt
- Session management

✅ **Server Management**
- Create, start, stop, and restart servers
- Multiple server types (Vanilla, Forge, Spigot, Paper, Bedrock)
- Port configuration (3002, 3003, 3004, etc.)
- Memory allocation settings
- Real-time status monitoring

✅ **Admin Panel**
- View all users
- View all servers
- Manage system-wide settings

✅ **Server Console**
- Live console output
- Command execution
- Server logs

✅ **Beautiful UI**
- Modern gradient design
- Responsive layout
- Easy to use interface

## Installation

1. **Install dependencies:**
```bash
cd gmc-panel
npm install
```

2. **Create admin account:**
```bash
node createadmin.js
```

3. **Start the panel:**
```bash
npm start
```

4. **Access the panel:**
Open your browser and go to: `http://localhost:3000`

## Default Ports

- Main Panel: **3000**
- Server Nodes: **3002, 3003, 3004** (configurable)

## Admin Account Creation

Run the `createadmin.js` script:

```bash
node createadmin.js
```

Follow the prompts to enter:
- Username
- Email
- Password

## Usage

### For Users:
1. Login with your credentials
2. Go to "Servers" page
3. Click "Create New Server"
4. Configure your server (name, port, memory, type)
5. Manage your server from the dashboard

### For Admins:
1. Access Admin Dashboard from the navigation
2. View all users and servers
3. Manage system settings

## Technology Stack

- **Backend:** Node.js, Express
- **Database:** SQLite3
- **Authentication:** bcryptjs, express-session
- **Frontend:** EJS templates, Vanilla CSS
- **Real-time:** WebSockets (planned)

## Project Structure

```
gmc-panel/
├── server.js           # Main server file
├── database.js         # Database functions
├── createadmin.js      # Admin creation script
├── package.json        # Dependencies
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── admin.js       # Admin routes
│   ├── servers.js     # Server management routes
│   └── api.js         # API routes
├── views/
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── servers.ejs
│   ├── create-server.ejs
│   ├── server-details.ejs
│   ├── admin-dashboard.ejs
│   └── partials/
│       └── header.ejs
└── public/
    └── css/
        └── style.css
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `POST /auth/register` - User registration

### Servers
- `GET /servers` - List user servers
- `POST /servers/create` - Create new server
- `GET /servers/:id` - Server details
- `POST /servers/:id/start` - Start server
- `POST /servers/:id/stop` - Stop server
- `POST /servers/:id/restart` - Restart server
- `DELETE /servers/:id` - Delete server

### Admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - List all users
- `GET /admin/servers` - List all servers

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- SQL injection prevention
- Input validation

## Future Enhancements

- WebSocket for real-time console
- File manager
- Backup system
- Plugin management
- Multi-node support
- Docker integration
- Email notifications
- Two-factor authentication

## License

MIT License

## Author

GMC Panel Development Team

## Support

For issues and questions, please create an issue on the repository.

---

**Note:** This is a basic panel for learning purposes. For production use, additional security measures and features should be implemented