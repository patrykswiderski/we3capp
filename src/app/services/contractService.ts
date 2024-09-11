import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export const saveContractInfo = async (username: string, address: string) => {
  try {
    await setDoc(doc(db, "contracts", address), {
      username,
      address,
    });
    console.log("Contract info saved successfully!");
  } catch (error) {
    console.error("Error saving contract info: ", error);
  }
};

export const getContractInfo = async (address: string) => {
  const docRef = doc(db, "contracts", address);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};
