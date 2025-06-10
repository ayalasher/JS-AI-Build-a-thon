import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";

// getting the token form the enviroment variable.
const token = process.env["GITHUB_TOKEN"];
// The endpoint where the request is going to be sent
const endpoint = "https://models.github.ai/inference";
// The AI model being used.
const model = "openai/gpt-4.1";

export async function main() {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  // Read and encode the image
  const imagePath = path.join(process.cwd(), "contoso_layout_sketch.jpg");
  const imageBuffer = fss.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        // role definitions of the AI and user
        // Each role has some content for it.
        { role: "system", content: "You are a helpful assistant that can analyze images and write code." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write HTML and CSS for a webpage based on the following handdrawn sketch"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        },
      ],
      // Model parameters.
      temperature: 1.0,
      top_p: 1.0,
      model: model,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  //   Logging the response from the AI model.
  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
