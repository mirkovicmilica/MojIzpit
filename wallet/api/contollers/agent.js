const axios = require('axios');

require("../models/invitations");
const mongoose = require("mongoose");


const aliceApiUrl = "http://agent3:8031";


const removeWallet = async (req, res) => {

    try {
        const response = await axios.post(`${aliceApiUrl}/multitenancy/wallet/${req.params.wallet_id}/remove`, req.body,{
            headers: {
                'x-api-key': process.env.ADMIN_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
}

const logInWallet = async (req, res) => {

    try {
        const response = await axios.post(`${aliceApiUrl}/multitenancy/wallet/${req.params.wallet_id}/token`, req.body,{
            headers: {
                'x-api-key': process.env.ADMIN_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
}



module.exports = {

    removeWallet,
    logInWallet
};
