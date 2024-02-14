import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getTheUser } from './api/user.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.post('/auth/login', async (req, res) => {
    try {
        const {username, password, orgcode} = req.body;
        if (!username || !password || !orgcode) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const userdetails = await getTheUser(username, password, orgcode);
        res.status(200).json(userdetails);
    } catch (error) {
        console.log('Error during Login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});