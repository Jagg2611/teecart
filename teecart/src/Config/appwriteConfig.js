// appwriteConfig.js
import { Client, Account, Databases } from 'appwrite';

export const PROJECTID = '666d5a67000b098c3384'; // Replace with your actual Project ID

export const DATABASEID = '6673282e001a7dd8278f';
export const COLLECTION_PROFILES = '66732897000bbf5e7258';
export const COLLECTION_CATEGORIES = '6673287a00166e18330b';
export const COLLECTION_ITEMLOG = '6674653f002e117c557a';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject(PROJECTID); // Your Project ID

const account = new Account(client);
const database = new Databases(client);


export { account };
export { database };


export default client;
