// dotenv Stack
import 'dotenv/config'

// Express Server Stack
import express from 'express';
import fs from 'fs';
const app = express()
const port = 3000
app.use(express.json());

// OpenAI Stack
import OpenAI from "openai";
const openai = new OpenAI();

// Anthropic Stack
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic();

// System Messages
const documentationMessage = "You are a 10x Swift engineer helping a mid-level Swift engineer to add DocC docs to their iOS and macOS code. Only return the updated code and nothing else."
const featureMessage = "You are a 10x Swift engineer helping a mid-level Swift engineer to add new features to their iOS and macOS codebase. They will ask you to create features for them. Only return the updated code and no markdown."

// This one documents code with ChatGPT.
app.post('/api/ChatGPT/4o/doc', async (req, res) => {

    const userMessage = req.body.message.content

    const messages = {
        model: "gpt-4o",
        messages: [{
            role: "developer",
            content: documentationMessage
        },
        {
            role: "developer",
            content: userMessage
        }],
        store: true,
    }

    const completion = await openai.chat.completions.create(messages);
    const message = completion.choices[0].message
    res.send({ message: message }).status(200)
})

// This one creates a new feature with ChatGPT.
app.post('/api/ChatGPT/4o/dev', async (req, res) => {

    const userMessage = req.body.message.content

    const messages = {
        model: "gpt-4o",
        messages: [{
            role: "developer",
            content: featureMessage
        },
        {
            role: "developer",
            content: userMessage
        }],
        store: true,
    }

    const completion = await openai.chat.completions.create(messages)
    const message = completion.choices[0]
    res.send(message).status(200)
})

app.post('/api/Anthropic/doc', async (req, res) => {

    const content = req.body.message.content

    const message = {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: documentationMessage,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: content
                    }
                ]
            }
        ]
    }

    const returnedMessage = await anthropic.messages.create(message)
    res.send(returnedMessage.text).status(200)

})

app.post('/api/Anthropic/dev', async (req, res) => {

    const content = req.body.message.content

    const message = {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: featureMessage,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: content
                    }
                ]
            }
        ]
    }

    const returnedMessage = await anthropic.messages.create(message)
    res.send(returnedMessage.text).status(200)

})

// Server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
