import { createServer } from './src/config/server.config.js';
import { connect } from './src/config/database.config.js';

const app = createServer()

const PORT = 5000;

app.listen(PORT, async () => {
    console.log(`Running on PORT ${PORT}`);
    // await connect()
})