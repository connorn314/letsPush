import { useAtom } from "jotai";
import { myWorkoutsState, userState } from "./atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { useEffect } from "react";

const useMyCommitments = () => {
    const [user,] = useAtom(userState);
    const [, setWorkouts] = useAtom(myWorkoutsState);

    useEffect(() => {
        if (!user) return;
        // console.log("useEffect running")
        // const toursRef = collection(FIRESTORE_DB, "commitments");
        const q = query(
            collection(FIRESTORE_DB, 'commitments'),
            where('userId', '==', user.id)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const workoutsArr: any[] = [];
                snapshot.docs.forEach(doc => {

                    // const tourStops = doc.data()
                    // console.log(doc.data(), console.log(doc.id))
                    workoutsArr.push({ id: doc.id, ...doc.data() })
                })
                setWorkouts(workoutsArr)
            }
        })

        return () => subscriber();
    }, [user])

}



export default useMyCommitments;