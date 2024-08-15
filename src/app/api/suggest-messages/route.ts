// import { openai } from '@ai-sdk/openai';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: "8dcf6265b828455d9491c3e06aee5850",
  baseURL: "https://api.aimlapi.com",
});

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // const result = await streamText({
        //     model: openai('gpt-3.5-turbo'),
        //     maxTokens: 500,
        //     prompt,
        // });
        
        // return result.toDataStreamResponse();

        const chatCompletion = await openai.chat.completions.create({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 128,
        });
        
        return NextResponse.json(chatCompletion.choices[0].message.content, { status: 200 });
        
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
          const { name, status, headers, message } = error;
          return NextResponse.json({
              name, status, headers, message
          }, { status });
      } else {
          console.error("An error occurred", error);
          throw error;
      }
  }
}

// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await openai.completions.create({
//       model: 'gpt-3.5-turbo',
//       stream: true,
//       prompt,
//     });

//     const stream = OpenAIStream(response);
    
    
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       // OpenAI API error handling
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     } else {
//       // General error handling
//       console.error('An unexpected error occurred:', error);
//       throw error;
//     }
//   }
// }