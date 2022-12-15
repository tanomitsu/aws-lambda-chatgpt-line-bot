import { Client, ClientConfig, TextMessage, WebhookEvent } from '@line/bot-sdk'
import { Configuration, OpenAIApi } from 'openai'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || ''
}

// instantiate
const client: Client = new Client(clientConfig)

// OpenAI confirutaion
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

// run
exports.handler = async (event: any, context: any) => {
  const body: any = JSON.parse(event.body)
  const response: WebhookEvent = body.events[0]
  console.log(`Message Received!`)

  try {
    await messageOrError(response)
  } catch (err) {
    console.log(err)
  }
}

const messageOrError = async (event: WebhookEvent): Promise<void> => {
  console.log(`Message or Error called!`)
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return
    }

    const { replyToken } = event
    const { text } = event.message

    console.log(`Message: ${text}`)
    console.log(`replying message...`)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text
    })

    console.log(`completion: ${completion}`)

    const openAiMessage: TextMessage = {
      type: 'text',
      text: completion.data.choices[0].text ?? 'ChatGPTと接続できませんでした。'
    }

    await client.replyMessage(replyToken, openAiMessage)
  } catch (err) {
    console.log(err)
  }
}
