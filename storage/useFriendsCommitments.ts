import { useAtom } from "jotai";
import { friendCommitmentsLoadingState, friendCommitmentsState, friendWeekPlansLoadingState, friendWeekPlansState, userState } from "./atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { daysOfWeek } from "@/util/helpers";

const useFriendsCommitments = () => {

    const [user,] = useAtom(userState);
    const [friendWeekPlans, setFriendWeekPlans] = useAtom(friendWeekPlansState);
    const [friendCommitments, setFriendCommitments] = useAtom(friendCommitmentsState);
    const [, setFriendCommitmentsLoading] = useAtom(friendCommitmentsLoadingState);
    const [, setFriendWeekPlansLoading] = useAtom(friendWeekPlansLoadingState)
    const days = daysOfWeek();
    const sundayDate = new Date(days[0].year, days[0].month - 1, days[0].day)
    const saturdayDate = new Date(days[6].year, days[6].month - 1, days[6].day)

    useEffect(() => {
        if (!user && friendWeekPlans.length){
            setFriendWeekPlans([]);
            return;
        }
        if (!user || !user.friends?.length) return;

        const q = query(
            collection(FIRESTORE_DB, 'week_plans'),
            where('userId', 'in', user.friends),
            where('start', '==', days[0].simpleString)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const weekArr: any[] = [];
                snapshot.docs.forEach(doc => {
                    weekArr.push({ id: doc.id, ...doc.data() })
                })
                setFriendWeekPlans(weekArr);
            },
            complete() {
                setFriendCommitmentsLoading(false)
            },
            error(error) {
                alert(JSON.stringify(error))
                setFriendCommitmentsLoading(false)
            },
        })

        return () => subscriber();

    }, [user])

    useEffect(() => {
        if (!user && friendCommitments.length) {
            setFriendCommitments([]);
            return;
        }
        if (!user || !user.friends?.length) return;

        const q = query(
            collection(FIRESTORE_DB, 'commitments'),
            where('userId', 'in', user.friends),
            where('startDate', '>=', sundayDate),
            where('startDate', '<=', saturdayDate)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const commitmentsArr: any[] = [];
                snapshot.docs.forEach(doc => {
                    commitmentsArr.push({ id: doc.id, ...doc.data() })
                })
                setFriendCommitments(commitmentsArr);
            },
            complete() {
                setFriendWeekPlansLoading(false)
            },
            error(error) {
                alert(JSON.stringify(error))
                setFriendWeekPlansLoading(false)
            },
        })

        return () => subscriber();
    }, [user])

    // useEffect(() => console.log("friend friendWeekPlans", friendWeekPlans), [friendWeekPlans])
    // useEffect(() => console.log("friend friendCommitments", friendCommitments), [friendCommitments])
}

export default useFriendsCommitments;