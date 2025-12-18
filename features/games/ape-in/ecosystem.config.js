module.exports = {
  apps: [
    {
      name: 'ape-in-backend',
      cwd: '/home/apedev/ape-in-bot/backend',
      script: '/home/apedev/ape-in-bot/backend/venv/bin/python3',
      args: '-m app.main',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        PYTHONUNBUFFERED: '1',
        PATH: '/home/apedev/ape-in-bot/backend/venv/bin:/usr/local/bin:/usr/bin:/bin'
      }
    },
    {
      name: 'ape-in-frontend',
      cwd: '/home/apedev/ape-in-bot/frontend',
      script: '/usr/bin/npm',
      args: 'run dev',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
}

