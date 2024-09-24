import { useAtom } from "jotai";
import { myWeekPlansState, myWorkoutsState, userState } from "./atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { useEffect } from "react";

const useMyCommitments = () => {
    const [user,] = useAtom(userState);
    const [, setWorkouts] = useAtom(myWorkoutsState);
    const [, setWeekPlans] = useAtom(myWeekPlansState);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(FIRESTORE_DB, 'commitments'),
            where('userId', '==', user.id)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const workoutsArr: any[] = [];
                snapshot.docs.forEach(doc => {
                    workoutsArr.push({ id: doc.id, ...doc.data() })
                })
                setWorkouts(workoutsArr)
            }
        })

        return () => subscriber();
    }, [user])

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(FIRESTORE_DB, 'week_plans'),
            where('userId', '==', user.id)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const weekPlansArr: any[] = [];
                snapshot.docs.forEach(doc => {
                    weekPlansArr.push({ id: doc.id, ...doc.data() })
                })
                setWeekPlans(weekPlansArr)
            }
        })

        return () => subscriber();
    }, [user])

}



export default useMyCommitments;