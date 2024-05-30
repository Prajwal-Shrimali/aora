import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.prajwal.aora',
    projectId: '6657537900023ffda6f1',
    databaseId: '665755550019505f799f',
    userCollectionId: '665755a8002d3d908b87',
    videoCollectionId: '665755dd0022df9074fc',
    storageId: '6657575000097c2c4b98'
}


const client = new Client();
client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);

        if (!newAccount) throw new Error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        // console.log(error);
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        // // Check for existing sessions
        // const sessions = await account.listSessions();
        // console.log(sessions)
        
        // // Delete existing sessions if any
        // if (sessions.total > 0) {
        //     for (const session of sessions.sessions) {
        //         await account.deleteSession(session.$id);
        //     }
        // }
        const session = await account.createEmailPasswordSession(email, password); // chnage in function name

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCUrrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return (await currentUser).documents[0];
    } catch (error) {
        console.log(error);
    }
}