import { Client, ClientConfig, TextMessage, WebhookEvent } from '@line/bot-sdk'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || ''
}

// instantiate
const client: Client = new Client(clientConfig)

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

    const exampleMessage: TextMessage = {
      type: 'text',
      text: 'メッセージは届いたよ！'
    }
    console.log(`replying message...`)
    await client.replyMessage(replyToken, exampleMessage)
  } catch (err) {
    console.log(err)
  }
}
