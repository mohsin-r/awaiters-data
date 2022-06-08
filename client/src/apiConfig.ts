const prod = {
    env: 'production',
    api_host: '/api'
}

const dev = {
    env: 'development',
    api_host: 'http://localhost:5000/api'
};

export default process.env.NODE_ENV === 'prod' ? prod : dev;