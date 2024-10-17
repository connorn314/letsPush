import { useAtom } from "jotai";
import { myWeekPlansState, myWorkoutsState, thisWeekPlanState, userState } from "./atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { useEffect } from "react";
import { WeekOfCommitments } from "@/types/workouts";

const useMyCommitments = () => {
    const [user,] = useAtom(userState);
    const [, setWorkouts] = useAtom(myWorkoutsState);
    const [, setWeekPlans] = useAtom(myWeekPlansState);
    const [, setThisWeekPlan] = useAtom(thisWeekPlanState);

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
                const today = new Date();
                snapshot.docs.forEach(doc => {
                    weekPlansArr.push({ id: doc.id, ...doc.data() })
                    const [yearA, monthA, dayA] = doc.data().start.split("/");
                    const [yearB, monthB, dayB] = doc.data().end.split("/");
                    if (new Date(yearA, monthA - 1, dayA) < today && new Date(yearB, monthB - 1, dayB) > today){
                        setThisWeekPlan({ id: doc.id, ...doc.data() } as WeekOfCommitments)
                    }
                })
                setWeekPlans(weekPlansArr)
            }
        })

        return () => subscriber();
    }, [user])

}



export default useMyCommitments;