import { DataAPIClient } from "@datastax/astra-db-ts"
import OpenAI from "openai"
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import puppeteer from "puppeteer";
import "dotenv/config"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
// import { browser } from "process";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const {ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY} = process.env

const openai = new OpenAI({apiKey: OPENAI_API_KEY})

const tennisData = [
    "https://en.wikipedia.org/wiki/Tennis",
    "https://en.wikipedia.org/wiki/Current_tennis_rankings",
    "https://www.tennis.com/",
    "https://www.wtatennis.com/",
    "https://www.atptour.com/en",
    "https://www.espn.com/tennis/",
    "https://www.theguardian.com/sport/tennis",
    "https://en.wikipedia.org/wiki/2025_ATP_Tour",
    "https://www.atptour.com/en/stats/individual-game-stats?factType=Aces&year=2024&surface=all&country=all&sortBy=percentage&sortDirection=desc",
    "https://en.wikipedia.org/wiki/List_of_Grand_Slam_men%27s_singles_champions"
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

// const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
//     const res = await db.createCollection(ASTRA_DB_COLLECTION,{
//         vector: {
//             dimension: 1536,
//             metric: similarityMetric
//         }
//     })
//     console.log(res)
// }

// const loadSampleData = async () => {
//     const collection = await db.collection(ASTRA_DB_COLLECTION)
//     for await (const url of tennisData){
//         const content = await scrapePage(url)
//         const chunks = await splitter.splitText(content)
//         for await (const chunk of chunks){
//             const embedding = await openai.embeddings.create({
//                 model: "text-embedding-3-small",
//                 input: chunk,
//                 encoding_format: "float"

//             })

//             const vector = embedding.data[0].embedding

//             const res = await collection.insertOne({
//                 $vector: vector,
//                 text: chunk
//             })
//             console.log(res)
//         }

//     }
// }

const loadSampleData = async () => {
    try {
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        console.log(`Connected to collection '${ASTRA_DB_COLLECTION}'.`);

        for await (const url of tennisData) {
            const content = await scrapePage(url);
            const chunks = await splitter.splitText(content);

            for await (const chunk of chunks) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: chunk,
                    encoding_format: "float"
                });

                const vector = embedding.data[0].embedding;

                const res = await collection.insertOne({
                    $vector: vector,
                    text: chunk
                });
                console.log("Inserted document:", res);
            }
        }
    } catch (error) {
        console.error("Error loading sample data:", error);
    }
};



const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
  }

//   createCollection().then(() => loadSampleData())

//update
loadSampleData();
