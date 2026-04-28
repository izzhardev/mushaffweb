import { useState, useEffect } from 'react';
import { Program, NewsItem, Donation } from '../types';
import { PROGRAMS, NEWS } from '../constants';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

export const useAppDatabase = () => {
  const { user, userProfile } = useAuth();
  const [programs] = useState<Program[]>(PROGRAMS);
  const [news] = useState<NewsItem[]>(NEWS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteerDonations, setVolunteerDonations] = useState<Donation[]>([]);

  // Generic state for other collections
  const [articles, setArticles] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [slider, setSlider] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Public listeners always active with error handling
    const handleError = (collectionName: string, error: any) => {
      console.error(`Error in ${collectionName} listener:`, error);
      if (error.code === 'unavailable') {
        setIsOffline(true);
      }
    };

    const unsubArticles = onSnapshot(collection(db, 'articles'), 
      (snapshot) => {
        setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsOffline(false);
      }, 
      (err) => handleError('articles', err)
    );

    const unsubSlider = onSnapshot(collection(db, 'slider'), 
      (snapshot) => {
        setSlider(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleError('slider', err)
    );

    const unsubGallery = onSnapshot(collection(db, 'gallery'), 
      (snapshot) => {
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleError('gallery', err)
    );

    const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), 
      (snapshot) => {
        setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleError('campaigns', err)
    );

    const unsubSettings = onSnapshot(collection(db, 'settings'), 
      (snapshot) => {
        setSettings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleError('settings', err)
    );

    const unsubActivities = onSnapshot(collection(db, 'activities'), 
      (snapshot) => {
        setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleError('activities', err)
    );

    let unsubDonations = () => {};
    let unsubReports = () => {};
    let unsubUsers = () => {};
    let unsubMedia = () => {};

    if (user) {
      // Donations listener - Admin sees all, User sees their own
      const donationsRef = collection(db, 'donations');
      const isAdmin = userProfile?.role === 'admin' || user.email === 'njas.izzhar@gmail.com';
      let qDonations;
      
      if (isAdmin) {
        qDonations = query(donationsRef, orderBy('timestamp', 'desc'));
      } else {
        qDonations = query(
          donationsRef,
          where('donorUid', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
      }

      unsubDonations = onSnapshot(qDonations, (snapshot) => {
        const donationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Donation[];
        setDonations(donationData);
      }, (error) => {
        console.error('Donations query error:', error);
        if (error.message.includes('index')) {
          const fallbackQuery = isAdmin 
            ? query(donationsRef)
            : query(donationsRef, where('donorUid', '==', user.uid));
            
          onSnapshot(fallbackQuery, (snap) => {
             const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donation[];
             setDonations(data.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
          });
        }
      });

      unsubReports = onSnapshot(collection(db, 'reports'), (snapshot) => {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      unsubMedia = onSnapshot(collection(db, 'media'), (snapshot) => {
        setMedia(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Volunteer Donations (donations referring to this user)
      const qVolunteer = query(
        donationsRef,
        where('referrerUid', '==', user.uid)
      );

      const unsubVolunteer = onSnapshot(qVolunteer, (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            timestamp: docData.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
            _rawTimestamp: docData.timestamp // Keep raw for sorting
          };
        }) as any[];

        // Sort client-side to avoid "Query requires an index" error
        data.sort((a, b) => {
          const timeA = a._rawTimestamp?.seconds || 0;
          const timeB = b._rawTimestamp?.seconds || 0;
          return timeB - timeA;
        });

        setVolunteerDonations(data as Donation[]);
      }, (error) => {
        console.error('Volunteer donations error:', error);
      });

      return () => {
        unsubArticles();
        unsubSlider();
        unsubGallery();
        unsubCampaigns();
        unsubSettings();
        unsubActivities();
        unsubDonations();
        unsubReports();
        unsubUsers();
        unsubMedia();
        unsubVolunteer();
      };
    } else {
      setDonations([]);
      setVolunteerDonations([]);
      setReports([]);
      setUsers([]);
      setMedia([]);
    }

    return () => {
      unsubArticles();
      unsubSlider();
      unsubGallery();
      unsubCampaigns();
      unsubSettings();
      unsubActivities();
    };
  }, [user, userProfile]);

  const addDonation = async (donation: Omit<Donation, 'id' | 'timestamp' | 'status'> & { status?: 'pending' | 'completed', referrerUid?: string }) => {
    if (!user) return null;

    const newDonation = {
      ...donation,
      donorUid: user.uid,
      timestamp: serverTimestamp(),
      status: donation.status || 'pending',
      referrerUid: donation.referrerUid || null
    };

    try {
      const docRef = await addDoc(collection(db, 'donations'), newDonation);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'donations');
      return null;
    }
  };

  // Generic CRUD functions
  const createItem = async (collectionName: string, data: any) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionName);
    }
  };

  const updateItem = async (collectionName: string, id: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const getDonationById = (id: string) => {
    return donations.find(d => d.id === id);
  };

  const saveSetting = async (id: string, data: any) => {
    try {
      await setDoc(doc(db, 'settings', id), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `settings/${id}`);
    }
  };

  return {
    programs,
    news,
    donations,
    volunteerDonations,
    articles,
    gallery,
    campaigns,
    reports,
    users,
    media,
    settings,
    slider,
    activities,
    addDonation,
    createItem,
    updateItem,
    deleteItem,
    getDonationById,
    saveSetting,
    isOffline
  };
};
