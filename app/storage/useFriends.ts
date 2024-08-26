import { useAtom } from "jotai";
import { myFriends, userState } from "../storage/atomStorage";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { useEffect } from "react";

const useFriends = () => {

    const [user,] = useAtom(userState);
    const [friends, setFriends] = useAtom(myFriends);

    useEffect(() => {
        if (!user && friends.length) {
            setFriends([]);
            return;
        }
        if (!user.friends) return;
        // console.log("useEffect running")
        // const toursRef = collection(FIRESTORE_DB, "commitments");
        const q = query(
            collection(FIRESTORE_DB, 'users'),
            where(documentId(), 'in', user.friends)

        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const friendsArr: any[] = [];
                snapshot.docs.forEach(doc => {

                    // const tourStops = doc.data()
                    // console.log(doc.data(), console.log(doc.id))
                    friendsArr.push({ id: doc.id, ...doc.data() })
                })
                setFriends(friendsArr)
            }
        })

        return () => subscriber();
    }, [user])
}

export default useFriends;