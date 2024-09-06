import { useAtom } from "jotai";
import { friendCommitmentsState, userState } from "../storage/atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { useEffect } from "react";

const useFriendsCommitments = () => {

    const [user,] = useAtom(userState);
    const [friendCommitments, setFriendCommitments] = useAtom(friendCommitmentsState);

    useEffect(() => {
        if (!user && friendCommitments.length) {
            setFriendCommitments([]);
            return;
        }
        if (!user || !user.friends?.length) return;
        // console.log("getting passed this useFriendsCommitments", user.friends)
        // console.log("useEffect running")
        // const toursRef = collection(FIRESTORE_DB, "commitments");
        const q = query(
            collection(FIRESTORE_DB, 'commitments'),
            where('userId', 'in', user.friends)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const commitmentsArr: any[] = [];
                snapshot.docs.forEach(doc => {

                    // const tourStops = doc.data()
                    // console.log(doc.data(), console.log(doc.id))
                    commitmentsArr.push({ id: doc.id, ...doc.data() })
                })
                setFriendCommitments(commitmentsArr);
            }
        })

        return () => subscriber();
    }, [user])
}

export default useFriendsCommitments;