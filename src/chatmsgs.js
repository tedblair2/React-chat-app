import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getMessages=async(receiverId)=>{
    // const combinedId= senderId>receiverId ? senderId+receiverId : receiverId+senderId
    const docRef = doc(db, "Users", receiverId);
    const docSnap = await getDoc(docRef);
    
    return docSnap.data()
}