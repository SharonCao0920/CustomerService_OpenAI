const fs = require('fs');
const tiktoken = require('tiktoken');
const axios = require('axios');
const openai = require('openai');
const csv = require('csv-parser');

// Load the cl100k_base tokenizer which is designed to work with the ada-002 model
const tokenizer = tiktoken.get_encoding("cl100k_base");

(async () => {
  const scrapedData = [];

  fs.createReadStream('processed/scraped.csv')
    .pipe(csv())
    .on('data', row => {
      scrapedData.push(row);
    })
    .on('end', async () => {
      const processedEmbeddings = [];

      for (const row of scrapedData) {
        const input = row.text; // Replace with the correct column name from your CSV
        const response = await openai.Embedding.create({ input, engine: 'text-embedding-ada-002' });
        const embedding = response.data[0].embedding;
        processedEmbeddings.push({ text: input, n_tokens: tokenizer.encode(input).length, embeddings: embedding });
      }

      // Save the processed embeddings to a CSV file
      const csvContent = processedEmbeddings.map(item => `${item.text},${item.n_tokens},${item.embeddings.join(',')}`).join('\n');
      fs.writeFileSync('processed/embeddings.csv', 'text,n_tokens,embeddings\n' + csvContent);

      console.log('Processing complete');
    });
})();
