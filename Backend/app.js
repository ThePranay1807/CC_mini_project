// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// AWS SDK v3 imports
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamoDocClient = DynamoDBDocumentClient.from(client);

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST route to add book record
app.post('/addBook', async (req, res) => {
    console.log('Request body:', req.body); // Debug log

    const { title, author, genre, issueDate, returnDate } = req.body;

    // Validate input
    if (!title || !author || !genre || !issueDate || !returnDate) {
        return res.status(400).send('All fields (title, author, genre, issueDate, returnDate) are required.');
    }

    const params = {
        TableName: 'LibraryRecords',
        Item: {
            BookID: uuidv4(),
            Title: title,
            Author: author,
            Genre: genre,
            IssueDate: issueDate,
            ReturnDate: returnDate
        }
    };

    try {
        await dynamoDocClient.send(new PutCommand(params));
        console.log('Added item:', params.Item);
        res.send('Book record added successfully!');
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).send('Error adding book record');
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
