const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectId;
const { NAME, USERNAME, PASSWORD } = require('../../config');
const BCRYPT_SALT_ROUNDS = 12; //salt rounds used in password crypto

// This controller manages the users in the application, creating and updating their data

module.exports = {
    // The store methods creates a new standard user based on the default values

    async store(_, res) {
        const name = NAME;
        const username = USERNAME;
        const password = PASSWORD;

        try {
            const hashedPassword = await bcrypt
                .hash(password, BCRYPT_SALT_ROUNDS)
                .catch(error => {
                    throw error;
                });

            if (!hashedPassword) throw 'Could not generate password';

            const user = await User.create({
                name: name,
                username: username,
                password: hashedPassword,
            }).catch(error => {
                throw error;
            });

            return res.json({ user });
        } catch (message) {
            return res.status(400).json({ message: String(message) });
        }
    },

    // The update methods updates a user based on the fields they want to alter.

    // To change the password, the method first checks if the current password is correct

    async update(req, res) {
        const { id } = req.auth;

        const { name, username, currentPass, newPass } = req.body;

        let updateDoc = {};

        if (name) updateDoc.name = name;

        if (username) updateDoc.username = username;

        try {
            if (currentPass && newPass) {
                const user = await User.findById(ObjectID(id));

                try {
                    const passwordMatch = await bcrypt.compare(
                        currentPass,
                        user.password,
                    );

                    if (passwordMatch) {
                        const hashedPassword = await bcrypt.hash(
                            newPass,
                            BCRYPT_SALT_ROUNDS,
                        );

                        if (!hashedPassword)
                            throw 'Failure generating new password';

                        updateDoc.password = hashedPassword;
                    } else
                        return res
                            .status(400)
                            .json({ error: 1, message: 'Incorrect password' });
                } catch (message) {
                    return res
                        .status(400)
                        .json({ error: 2, message: String(message) });
                }
            }

            await User.updateOne(
                {
                    _id: ObjectID(id),
                },
                {
                    $set: updateDoc,
                },
            );
        } catch (message) {
            return res.status(400).json({ error: 2, message: String(message) });
        }

        return res.status(204).send();
    },
};
