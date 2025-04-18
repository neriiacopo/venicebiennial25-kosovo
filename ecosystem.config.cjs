module.exports = {
  apps: [
    {
      name: 'nex_store_demo',
      script: 'npm',
      args: 'run start',
      watch: false,
      env: {
        "NODE_ENV": "production",
        "NODE_PORT": 1342
      }
    },
  ],
};
