import { createServer } from './src/config/server.config.js';

const app = createServer()

const PORT = 5000;

app.listen(PORT,() => {
    console.log(`Running on PORT ${PORT}`);
})