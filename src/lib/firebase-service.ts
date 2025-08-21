
// src/lib/firebase-service.ts
import { db, storage } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Campaign, GeneratedItem, StoredFile, SessionPrep } from './types';

// Campaign functions
export const getCampaigns = async (): Promise<Campaign[]> => {
    const campaignsCol = collection(db, 'campaigns');
    const campaignSnapshot = await getDocs(query(campaignsCol, orderBy('name')));
    const campaignList = campaignSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
    return campaignList;
};

export const getCampaign = async (id: string): Promise<Campaign | null> => {
    const campaignDoc = doc(db, 'campaigns', id);
    const campaignSnap = await getDoc(campaignDoc);
    if (campaignSnap.exists()) {
        return { id: campaignSnap.id, ...campaignSnap.data() } as Campaign;
    } else {
        return null;
    }
};

export const addCampaign = async (campaignData: Omit<Campaign, 'id'>): Promise<string> => {
    const campaignsCol = collection(db, 'campaigns');
    const docRef = await addDoc(campaignsCol, campaignData);
    return docRef.id;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<void> => {
    const campaignDoc = doc(db, 'campaigns', id);
    await updateDoc(campaignDoc, campaignData);
};

export const deleteCampaign = async (id: string): Promise<void> => {
    // Also delete associated session preps and items if necessary
    const preps = await getSessionPrepsForCampaign(id);
    for (const prep of preps) {
        await deleteDoc(doc(db, 'sessionPreps', prep.id));
    }
    const campaignDoc = doc(db, 'campaigns', id);
    await deleteDoc(campaignDoc);
};

// File upload function
export const uploadFile = async (file: File, path: string): Promise<StoredFile> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { name: file.name, url, path };
}

// GeneratedItem functions
export const addGeneratedItem = async (campaignId: string | null, type: GeneratedItem['type'], content: any): Promise<string> => {
    const itemsCol = collection(db, 'generatedItems');
    const docRef = await addDoc(itemsCol, {
        campaignId,
        type,
        content,
        createdAt: Date.now(),
    });
    return docRef.id;
};


export const getGeneratedItemsForCampaign = async (campaignId: string): Promise<GeneratedItem[]> => {
    const itemsCol = collection(db, 'generatedItems');
    const q = query(itemsCol, where('campaignId', '==', campaignId), orderBy('createdAt', 'desc'));
    const itemSnapshot = await getDocs(q);
    const itemList = itemSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
        } as GeneratedItem
    });
    return itemList;
};

export const getAllGeneratedItems = async (): Promise<GeneratedItem[]> => {
    const itemsCol = collection(db, 'generatedItems');
    const q = query(itemsCol, orderBy('createdAt', 'desc'));
    const itemSnapshot = await getDocs(q);
    return itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedItem));
}


export const getGeneratedItemsByType = async (type: GeneratedItem['type']): Promise<GeneratedItem[]> => {
    const itemsCol = collection(db, 'generatedItems');
    const q = query(itemsCol, where('type', '==', type), orderBy('createdAt', 'desc'));
    const itemSnapshot = await getDocs(q);
    const itemList = itemSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as GeneratedItem));
    return itemList;
};

// SessionPrep functions
export const addSessionPrep = async (prepData: Omit<SessionPrep, 'id'>): Promise<string> => {
    const prepsCol = collection(db, 'sessionPreps');
    const docRef = await addDoc(prepsCol, prepData);
    return docRef.id;
};

export const getSessionPrep = async (id: string): Promise<SessionPrep | null> => {
    const prepDoc = doc(db, 'sessionPreps', id);
    const prepSnap = await getDoc(prepDoc);
    return prepSnap.exists() ? { id: prepSnap.id, ...prepSnap.data() } as SessionPrep : null;
};

export const getSessionPrepsForCampaign = async (campaignId: string): Promise<SessionPrep[]> => {
    const prepsCol = collection(db, 'sessionPreps');
    const q = query(prepsCol, where('campaignId', '==', campaignId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionPrep));
};

export const updateSessionPrep = async (id: string, prepData: Partial<SessionPrep>): Promise<void> => {
    const prepDoc = doc(db, 'sessionPreps', id);
    await updateDoc(prepDoc, prepData);
};

export const deleteSessionPrep = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'sessionPreps', id));
};
