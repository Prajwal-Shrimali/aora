import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.prajwal.aora",
  projectId: "6657537900023ffda6f1",
  databaseId: "665755550019505f799f",
  userCollectionId: "665755a8002d3d908b87",
  videoCollectionId: "665755dd0022df9074fc",
  storageId: "6657575000097c2c4b98"
};

const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error();
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl
      }
    );

    return newUser;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password); // chnage in function name

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCUrrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return (await currentUser).documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
		const posts = await databases.listDocuments(
			config.databaseId, 
			config.videoCollectionId
		);
		
		return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
		const posts = await databases.listDocuments(
			config.databaseId, 
			config.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
		);
		
		return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
		const posts = await databases.listDocuments(
			config.databaseId, 
			config.videoCollectionId,
      [Query.search('title', query)]
		);
		
		return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPost = async (userId) => {
  try {
		const posts = await databases.listDocuments(
			config.databaseId, 
			config.videoCollectionId,
      [Query.equal('creator', userId)]
		);
		
		return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};