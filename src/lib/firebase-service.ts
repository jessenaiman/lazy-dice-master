
// src/lib/firebase-service.ts
import { db, storage } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Campaign, GeneratedItem, StoredFile } from './types';

// Campaign functions
export const getCampaigns = async (): Promise<Campaign[]> => {
    const campaignsCol = collection(db, 'campaigns');
    const campaignSnapshot = await getDocs(campaignsCol);
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
export const addGeneratedItem = async (campaignId: string, type: GeneratedItem['type'], content: any): Promise<string> => {
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
    const q = query(itemsCol, where('campaignId', '==', campaignId));
    const itemSnapshot = await getDocs(q);
    const itemList = itemSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
        } as GeneratedItem
    });
    return itemList.sort((a, b) => b.createdAt - a.createdAt);
};
